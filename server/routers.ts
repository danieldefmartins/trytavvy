import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  searchPlaces,
  getPlaceById,
  getPlacesCount,
  getAllReviewItems,
  getReviewItemsByType,
  getPlaceSignalAggregates,
  batchImportReviews,
  getRepStats,
  type BatchReviewInput,
  // Tavvy Places
  createTavvyPlace,
  getTavvyPlacesByCreator,
  getTavvyCategories,
  type TavvyPlaceInput,
} from "./supabaseDb";
import { getDb } from "./db";
import { repActivityLog, batchImportJobs } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { syncProToGHL, createGHLContact, findGHLContactByEmail, addGHLContactTags } from "./ghl";
import {
  signInWithEmail,
  verifySupabaseToken,
} from "./supabaseAuth";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  getSubscription,
  verifyWebhookSignature,
  verifyCheckoutSession,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handlePaymentSucceeded,
  handlePaymentFailed,
} from "./stripe";
import { STRIPE_CONFIG } from "../shared/stripe-config";

// Cookie name for Supabase auth token
const AUTH_COOKIE_NAME = "tavvy_auth_token";

// Super admin email
const SUPER_ADMIN_EMAIL = "daniel@360forbusiness.com";

export const appRouter = router({
  // Auth router - Login only (no signup)
  auth: router({
    me: publicProcedure.query(async ({ ctx }) => {
      // Get token from cookie
      const token = ctx.req.cookies?.[AUTH_COOKIE_NAME];
      if (!token) return null;

      // Verify token with Supabase
      const user = await verifySupabaseToken(token);
      if (!user) return null;

      // Check if user is the super admin
      const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;

      return {
        id: user.id,
        openId: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        role: isSuperAdmin ? "super_admin" : "pro",
        isSuperAdmin,
      };
    }),

    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // For Pros Portal: Allow any registered user to login
        const { user, session, error } = await signInWithEmail(
          input.email,
          input.password
        );

        if (error || !user || !session) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: error || "Invalid credentials",
          });
        }

        // Set auth cookie
        ctx.res.cookie(AUTH_COOKIE_NAME, session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
          path: "/",
        });

        const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split("@")[0],
            isSuperAdmin,
          },
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(AUTH_COOKIE_NAME, { path: "/" });
      return { success: true };
    }),
  }),

  // Places router - search and manage places from Supabase
  places: router({
    search: protectedProcedure
      .input(
        z.object({
          query: z.string().min(1),
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
      )
      .query(async ({ input }) => {
        return searchPlaces(input.query, input.limit, input.offset);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return getPlaceById(input.id);
      }),

    getCount: protectedProcedure.query(async () => {
      return getPlacesCount();
    }),

    getSignals: protectedProcedure
      .input(z.object({ placeId: z.string() }))
      .query(async ({ input }) => {
        return getPlaceSignalAggregates(input.placeId);
      }),

    // ============ TAVVY PLACES (Pro-Created) ============
    
    // Get tavvy categories for dropdown
    getTavvyCategories: protectedProcedure.query(() => {
      return getTavvyCategories();
    }),

    // Create a new tavvy place
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required").max(200),
          description: z.string().max(2000).optional(),
          tavvy_category: z.string().min(1, "Category is required"),
          tavvy_subcategory: z.string().optional(),
          latitude: z.number().min(-90).max(90).optional(),
          longitude: z.number().min(-180).max(180).optional(),
          address: z.string().max(500).optional(),
          address_line2: z.string().max(200).optional(),
          city: z.string().max(100).optional(),
          region: z.string().max(100).optional(),
          postcode: z.string().max(20).optional(),
          country: z.string().max(100).optional(),
          phone: z.string().max(50).optional(),
          email: z.string().email().optional().or(z.literal("")),
          website: z.string().url().optional().or(z.literal("")),
          instagram: z.string().max(100).optional(),
          facebook: z.string().max(200).optional(),
          twitter: z.string().max(100).optional(),
          tiktok: z.string().max(100).optional(),
          hours_display: z.string().max(500).optional(),
          price_level: z.number().min(1).max(4).optional(),
          cover_image_url: z.string().url().optional().or(z.literal("")),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user?.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to create a place",
          });
        }

        // Clean up empty strings
        const cleanInput: TavvyPlaceInput = {
          ...input,
          email: input.email || null,
          website: input.website || null,
          cover_image_url: input.cover_image_url || null,
        };

        const place = await createTavvyPlace(cleanInput, userId);
        if (!place) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create place",
          });
        }

        return place;
      }),

    // Get places created by the current pro
    getMyPlaces: protectedProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        }).optional()
      )
      .query(async ({ ctx, input }) => {
        const userId = ctx.user?.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be logged in to view your places",
          });
        }

        const limit = input?.limit || 50;
        const offset = input?.offset || 0;
        return getTavvyPlacesByCreator(userId, limit, offset);
      }),
  }),

  // Signals router - get signal definitions
  signals: router({
    getAll: protectedProcedure.query(async () => {
      return getAllReviewItems();
    }),

    getByType: protectedProcedure
      .input(z.object({ type: z.enum(["best_for", "vibe", "heads_up"]) }))
      .query(async ({ input }) => {
        return getReviewItemsByType(input.type);
      }),
  }),

  // Reviews router - submit reviews
  reviews: router({
    submitQuick: protectedProcedure
      .input(
        z.object({
          placeId: z.string(),
          signals: z.array(
            z.object({
              signalSlug: z.string(),
              tapCount: z.number().min(1).max(3),
            })
          ),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });

        const userId = ctx.user?.id || "anonymous";

        // Log each signal submission
        for (const signal of input.signals) {
          await db.insert(repActivityLog).values({
            oderId: userId,
            placeId: input.placeId,
            signalSlug: signal.signalSlug,
            tapCount: signal.tapCount,
            source: "manual",
          });
        }

        // Import to Supabase
        const batchInput: BatchReviewInput[] = input.signals.map((s) => ({
          place_id: input.placeId,
          signal_slug: s.signalSlug,
          tap_count: s.tapCount,
        }));

        const result = await batchImportReviews(batchInput, userId);
        return result;
      }),

    batchImport: protectedProcedure
      .input(
        z.object({
          reviews: z.array(
            z.object({
              place_id: z.string(),
              signal_slug: z.string(),
              tap_count: z.number().min(1).max(10),
            })
          ),
          fileName: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });

        const userId = ctx.user?.id || "anonymous";

        // Create batch import job
        const jobResult = await db.insert(batchImportJobs).values({
          oderId: userId,
          fileName: input.fileName,
          totalRows: input.reviews.length,
          status: "processing",
        });

        const jobId = jobResult[0].insertId;

        // Log each review
        for (const review of input.reviews) {
          await db.insert(repActivityLog).values({
            oderId: userId,
            placeId: review.place_id,
            signalSlug: review.signal_slug,
            tapCount: review.tap_count,
            source: "batch",
          });
        }

        // Import to Supabase
        const result = await batchImportReviews(input.reviews, userId);

        // Update job status
        await db
          .update(batchImportJobs)
          .set({
            successCount: result.success,
            failedCount: result.failed,
            status: "completed",
            errorLog: result.errors.length > 0 ? result.errors.join("\n") : null,
            completedAt: new Date(),
          })
          .where(eq(batchImportJobs.id, Number(jobId)));

        return { jobId, ...result };
      }),
  }),

  // GoHighLevel sync router
  ghl: router({
    syncContact: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          fullName: z.string().min(1),
          phone: z.string().optional(),
          businessName: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          website: z.string().optional(),
          services: z.array(z.string()).optional(),
          yearsExperience: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const apiKey = process.env.GHL_API_KEY;
        const locationId = process.env.GHL_LOCATION_ID;

        if (!apiKey || !locationId) {
          console.warn("GHL credentials not configured");
          return { success: false, error: "GHL not configured" };
        }

        const result = await syncProToGHL(input, apiKey, locationId);
        return result;
      }),
    // Affiliate signup - creates contact in GHL with affiliate-signup tag
    affiliateSignup: publicProcedure
      .input(
        z.object({
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const apiKey = process.env.GHL_API_KEY;
        const locationId = process.env.GHL_LOCATION_ID;
        if (!apiKey || !locationId) {
          console.warn("GHL credentials not configured");
          return { success: false, error: "GHL not configured" };
        }
        try {
          // Check if contact already exists
          const existing = await findGHLContactByEmail(input.email, apiKey, locationId);
          if (existing.found && existing.contactId) {
            // Add affiliate tag to existing contact
            await addGHLContactTags(
              existing.contactId,
              ['affiliate-signup', 'Tavvy Affiliate'],
              apiKey
            );
            return { 
              success: true, 
              contactId: existing.contactId,
              message: 'Affiliate signup submitted successfully' 
            };
          }
          // Create new contact with affiliate tags
          const result = await createGHLContact(
            {
              firstName: input.firstName,
              lastName: input.lastName,
              email: input.email,
              phone: input.phone,
              tags: ['affiliate-signup', 'Tavvy Affiliate', 'New Affiliate'],
            },
            apiKey,
            locationId
          );
          return {
            success: result.success,
            contactId: result.contactId,
            message: result.success 
              ? 'Affiliate signup submitted successfully' 
              : 'Signup failed, please try again',
            error: result.error,
          };
        } catch (error) {
          console.error('Affiliate signup error:', error);
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      }),
  }),

  // Rep stats router
  stats: router({
    getMyStats: protectedProcedure.query(async ({ ctx }) => {
      const userId = ctx.user?.id || ctx.user?.openId || "anonymous";
      return getRepStats(userId);
    }),

    getActivityLog: protectedProcedure
      .input(
        z
          .object({
            limit: z.number().min(1).max(100).default(50),
          })
          .optional()
      )
      .query(async ({ ctx }) => {
        const db = await getDb();
        if (!db) return [];

        const oderId = ctx.user?.id || "anonymous";

        return db
          .select()
          .from(repActivityLog)
          .where(eq(repActivityLog.oderId, oderId))
          .orderBy(desc(repActivityLog.createdAt))
          .limit(50);
      }),

    getBatchJobs: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const oderId = ctx.user?.id || "anonymous";

      return db
        .select()
        .from(batchImportJobs)
        .where(eq(batchImportJobs.oderId, oderId))
        .orderBy(desc(batchImportJobs.createdAt))
        .limit(20);
    }),
  }),
  // Stripe subscription router
  stripe: router({
    createCheckout: publicProcedure
      .input(
        z.object({
          plan: z.enum(["pro", "proPlus"]),
          interval: z.enum(["monthly", "annual"]),
          couponId: z.string().optional(),
          email: z.string().email().optional(),
          affiliateId: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { plan, interval, couponId, email, affiliateId } = input;
        
        // Get price ID from config
        const priceId = STRIPE_CONFIG.products[plan].prices[interval].id;
        
        // Get user email from session or input
        const customerEmail = email || ctx.user?.email;
        
        // Create checkout session
        const session = await createCheckoutSession({
          priceId,
          plan,
          interval,
          couponId,
          customerEmail,
          userId: ctx.user?.id,
          portalType: 'pros',
          affiliateId,
          successUrl: `${process.env.PUBLIC_URL || 'http://localhost:5000'}/signup?payment=success&plan=${plan}&cycle=${interval}&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${process.env.PUBLIC_URL || 'http://localhost:5000'}/subscription/cancel`,
        });
        
        return {
          sessionId: session.id,
          url: session.url,
        };
      }),
    
    createPortal: protectedProcedure
      .input(
        z.object({
          customerId: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const session = await createCustomerPortalSession(
          input.customerId,
          `${process.env.PUBLIC_URL || 'http://localhost:5000'}/subscription`
        );
        
        return {
          url: session.url,
        };
      }),
    
    getSubscription: protectedProcedure
      .input(
        z.object({
          subscriptionId: z.string(),
        })
      )
      .query(async ({ input }) => {
        const subscription = await getSubscription(input.subscriptionId);
        return subscription;
      }),

    // Verify checkout session - CRITICAL for preventing payment bypass
    verifySession: publicProcedure
      .input(
        z.object({
          sessionId: z.string(),
        })
      )
      .query(async ({ input }) => {
        const result = await verifyCheckoutSession(input.sessionId);
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
