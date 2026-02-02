import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;

/**
 * Get Supabase PostgreSQL connection
 * Uses the SUPABASE_DATABASE_URL environment variable
 */
export function getSupabaseDb() {
  if (!_sql && process.env.SUPABASE_DATABASE_URL) {
    try {
      _sql = postgres(process.env.SUPABASE_DATABASE_URL, {
        ssl: { rejectUnauthorized: false },
        max: 10,
        idle_timeout: 20,
        connect_timeout: 30,
      });
    } catch (error) {
      console.warn("[Supabase] Failed to connect:", error);
      _sql = null;
    }
  }
  return _sql;
}

// ============ PLACES QUERIES ============

export interface Place {
  id: string;
  name: string;
  description: string | null;
  primary_category: string | null;
  category: string | null;
  lat: number;
  lng: number;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  website: string | null;
  cover_image_url: string | null;
  is_active: boolean;
  fsq_place_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function searchPlaces(
  query: string,
  limit: number = 50,
  offset: number = 0
): Promise<Place[]> {
  const sql = getSupabaseDb();
  if (!sql) return [];

  const searchPattern = `%${query}%`;
  const result = await sql<Place[]>`
    SELECT id, name, description, primary_category, category, lat, lng,
           address_line1, city, state, postal_code, country, phone, website,
           cover_image_url, is_active, fsq_place_id, created_at, updated_at
    FROM places
    WHERE name ILIKE ${searchPattern}
       OR city ILIKE ${searchPattern}
       OR address_line1 ILIKE ${searchPattern}
    ORDER BY name ASC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return result;
}

export async function getPlaceById(placeId: string): Promise<Place | null> {
  const sql = getSupabaseDb();
  if (!sql) return null;

  const result = await sql<Place[]>`
    SELECT id, name, description, primary_category, category, lat, lng,
           address_line1, city, state, postal_code, country, phone, website,
           cover_image_url, is_active, fsq_place_id, created_at, updated_at
    FROM places
    WHERE id = ${placeId}
    LIMIT 1
  `;
  return result.length > 0 ? result[0] : null;
}

export async function getPlacesCount(): Promise<number> {
  const sql = getSupabaseDb();
  if (!sql) return 0;

  const result = await sql`SELECT COUNT(*) as count FROM places`;
  return parseInt(result[0].count as string, 10);
}

// ============ REVIEW ITEMS (SIGNALS) QUERIES ============

export interface ReviewItem {
  id: string;
  slug: string;
  label: string;
  icon_emoji: string | null;
  signal_type: "best_for" | "vibe" | "heads_up";
  color: string | null;
  is_universal: boolean;
  sort_order: number;
  is_active: boolean;
}

export async function getAllReviewItems(): Promise<ReviewItem[]> {
  const sql = getSupabaseDb();
  if (!sql) return [];

  const result = await sql<ReviewItem[]>`
    SELECT id, slug, label, icon_emoji, signal_type, color, is_universal, sort_order, is_active
    FROM review_items
    WHERE is_active = true
    ORDER BY signal_type, sort_order ASC
  `;
  return result;
}

export async function getReviewItemsByType(signalType: string): Promise<ReviewItem[]> {
  const sql = getSupabaseDb();
  if (!sql) return [];

  const result = await sql<ReviewItem[]>`
    SELECT id, slug, label, icon_emoji, signal_type, color, is_universal, sort_order, is_active
    FROM review_items
    WHERE signal_type = ${signalType} AND is_active = true
    ORDER BY sort_order ASC
  `;
  return result;
}

// ============ REVIEWS QUERIES ============

export interface Review {
  id: string;
  place_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewSignal {
  id: string;
  review_id: string;
  signal_id: string;
  intensity: number;
  created_at: Date;
}

export async function createReview(
  placeId: string,
  userId: string
): Promise<string | null> {
  const sql = getSupabaseDb();
  if (!sql) return null;

  const result = await sql`
    INSERT INTO reviews (place_id, user_id, created_at, updated_at)
    VALUES (${placeId}, ${userId}, NOW(), NOW())
    RETURNING id
  `;
  return result.length > 0 ? (result[0].id as string) : null;
}

export async function addReviewSignal(
  reviewId: string,
  signalId: string,
  intensity: number
): Promise<string | null> {
  const sql = getSupabaseDb();
  if (!sql) return null;

  const result = await sql`
    INSERT INTO review_signals (review_id, signal_id, intensity, created_at)
    VALUES (${reviewId}, ${signalId}, ${intensity}, NOW())
    RETURNING id
  `;
  return result.length > 0 ? (result[0].id as string) : null;
}

// ============ PLACE SIGNAL AGGREGATES ============

export interface PlaceSignalAggregate {
  place_id: string;
  signal_id: string;
  signal_slug: string;
  signal_type: string;
  bucket: string;
  tap_total: number;
  review_count: number;
  last_tap_at: Date | null;
}

export async function getPlaceSignalAggregates(placeId: string): Promise<PlaceSignalAggregate[]> {
  const sql = getSupabaseDb();
  if (!sql) return [];

  const result = await sql<PlaceSignalAggregate[]>`
    SELECT psa.place_id, psa.signal_id, ri.slug as signal_slug, ri.signal_type, 
           psa.bucket, psa.tap_total, psa.review_count, psa.last_tap_at
    FROM place_signal_aggregates psa
    LEFT JOIN review_items ri ON ri.id = psa.signal_id
    WHERE psa.place_id = ${placeId}
    ORDER BY psa.tap_total DESC
  `;
  return result;
}

export async function upsertPlaceSignalAggregate(
  placeId: string,
  signalId: string,
  bucket: string,
  tapCount: number
): Promise<void> {
  const sql = getSupabaseDb();
  if (!sql) return;

  await sql`
    INSERT INTO place_signal_aggregates (place_id, signal_id, bucket, tap_total, review_count, last_tap_at)
    VALUES (${placeId}, ${signalId}, ${bucket}, ${tapCount}, 1, NOW())
    ON CONFLICT (place_id, signal_id, bucket)
    DO UPDATE SET
      tap_total = place_signal_aggregates.tap_total + ${tapCount},
      review_count = place_signal_aggregates.review_count + 1,
      last_tap_at = NOW()
  `;
}

// ============ BATCH IMPORT ============

export interface BatchReviewInput {
  place_id: string;
  signal_slug: string;
  tap_count: number;
  rep_id?: string;
}

export async function batchImportReviews(
  reviews: BatchReviewInput[],
  repUserId: string
): Promise<{ success: number; failed: number; errors: string[] }> {
  const sql = getSupabaseDb();
  if (!sql) return { success: 0, failed: reviews.length, errors: ["Database not connected"] };

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const review of reviews) {
    try {
      // Get signal info
      const signalResult = await sql`
        SELECT id, signal_type FROM review_items WHERE slug = ${review.signal_slug} LIMIT 1
      `;
      
      if (signalResult.length === 0) {
        errors.push(`Signal not found: ${review.signal_slug}`);
        failed++;
        continue;
      }

      const signalId = signalResult[0].id as string;
      const signalType = signalResult[0].signal_type as string;
      
      // Determine bucket based on signal type
      const bucket = signalType === "best_for" ? "positive" : 
                     signalType === "heads_up" ? "negative" : "neutral";

      // Create review
      const reviewResult = await sql`
        INSERT INTO reviews (place_id, user_id, created_at, updated_at)
        VALUES (${review.place_id}, ${repUserId}, NOW(), NOW())
        RETURNING id
      `;

      if (reviewResult.length === 0) {
        errors.push(`Failed to create review for place: ${review.place_id}`);
        failed++;
        continue;
      }

      const reviewId = reviewResult[0].id as string;

      // Add review signal
      await sql`
        INSERT INTO review_signals (review_id, signal_id, intensity, created_at)
        VALUES (${reviewId}, ${signalId}, ${review.tap_count}, NOW())
      `;

      // Update aggregates
      await upsertPlaceSignalAggregate(review.place_id, signalId, bucket, review.tap_count);

      success++;
    } catch (error) {
      errors.push(`Error processing review for place ${review.place_id}: ${error}`);
      failed++;
    }
  }

  return { success, failed, errors };
}

// ============ REP STATS ============

export interface RepStats {
  total_reviews: number;
  reviews_today: number;
  reviews_this_week: number;
  places_reviewed: number;
}

export async function getRepStats(userId: string): Promise<RepStats> {
  const sql = getSupabaseDb();
  if (!sql) return { total_reviews: 0, reviews_today: 0, reviews_this_week: 0, places_reviewed: 0 };

  const result = await sql`
    SELECT 
      COUNT(*) as total_reviews,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as reviews_today,
      COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as reviews_this_week,
      COUNT(DISTINCT place_id) as places_reviewed
    FROM reviews
    WHERE user_id = ${userId}
  `;

  return {
    total_reviews: parseInt(result[0].total_reviews as string, 10),
    reviews_today: parseInt(result[0].reviews_today as string, 10),
    reviews_this_week: parseInt(result[0].reviews_this_week as string, 10),
    places_reviewed: parseInt(result[0].places_reviewed as string, 10),
  };
}


// ============ TAVVY PLACES (User-Generated) ============

export interface TavvyPlaceInput {
  name: string;
  description?: string | null;
  tavvy_category: string;
  tavvy_subcategory?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  address_line2?: string | null;
  city?: string | null;
  region?: string | null;
  postcode?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
  hours_display?: string | null;
  hours_json?: any;
  price_level?: number | null;
  photos?: string[] | null;
  cover_image_url?: string | null;
}

export interface TavvyPlace extends TavvyPlaceInput {
  id: string;
  is_verified: boolean;
  is_claimed: boolean;
  source: string;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  deleted_at: Date | null;
}

export async function createTavvyPlace(
  input: TavvyPlaceInput,
  createdBy: string
): Promise<TavvyPlace | null> {
  const sql = getSupabaseDb();
  if (!sql) return null;

  try {
    const result = await sql<TavvyPlace[]>`
      INSERT INTO tavvy_places (
        name, description, tavvy_category, tavvy_subcategory,
        latitude, longitude, address, address_line2,
        city, region, postcode, country,
        phone, email, website, instagram, facebook, twitter, tiktok,
        hours_display, hours_json, price_level,
        photos, cover_image_url,
        source, created_by
      ) VALUES (
        ${input.name},
        ${input.description || null},
        ${input.tavvy_category},
        ${input.tavvy_subcategory || null},
        ${input.latitude || null},
        ${input.longitude || null},
        ${input.address || null},
        ${input.address_line2 || null},
        ${input.city || null},
        ${input.region || null},
        ${input.postcode || null},
        ${input.country || null},
        ${input.phone || null},
        ${input.email || null},
        ${input.website || null},
        ${input.instagram || null},
        ${input.facebook || null},
        ${input.twitter || null},
        ${input.tiktok || null},
        ${input.hours_display || null},
        ${input.hours_json ? JSON.stringify(input.hours_json) : null}::jsonb,
        ${input.price_level || null},
        ${input.photos || null},
        ${input.cover_image_url || null},
        'pro',
        ${createdBy}
      )
      RETURNING *
    `;

    if (result.length > 0) {
      console.log(`[Supabase] Created new tavvy place: ${result[0].name} (${result[0].id})`);
      return result[0];
    }
    return null;
  } catch (error) {
    console.error("[Supabase] Create tavvy place error:", error);
    return null;
  }
}

export async function getTavvyPlacesByCreator(
  createdBy: string,
  limit: number = 50,
  offset: number = 0
): Promise<TavvyPlace[]> {
  const sql = getSupabaseDb();
  if (!sql) return [];

  try {
    const result = await sql<TavvyPlace[]>`
      SELECT * FROM tavvy_places
      WHERE created_by = ${createdBy}
        AND is_deleted = false
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return result;
  } catch (error) {
    console.error("[Supabase] Get tavvy places by creator error:", error);
    return [];
  }
}

// Get all tavvy categories for dropdown
export function getTavvyCategories(): { slug: string; name: string }[] {
  return [
    { slug: 'arts', name: 'Arts & Culture' },
    { slug: 'automotive', name: 'Automotive' },
    { slug: 'nightlife', name: 'Bars & Nightlife' },
    { slug: 'beauty', name: 'Beauty & Personal Care' },
    { slug: 'business', name: 'Business Services' },
    { slug: 'coffee_tea', name: 'Coffee & Tea' },
    { slug: 'education', name: 'Education' },
    { slug: 'entertainment', name: 'Entertainment' },
    { slug: 'events', name: 'Events & Venues' },
    { slug: 'financial', name: 'Financial Services' },
    { slug: 'fitness', name: 'Fitness & Sports' },
    { slug: 'food', name: 'Food & Dining' },
    { slug: 'government', name: 'Government' },
    { slug: 'health', name: 'Health & Medical' },
    { slug: 'home', name: 'Home Services' },
    { slug: 'hotels', name: 'Hotels & Lodging' },
    { slug: 'legal', name: 'Legal Services' },
    { slug: 'outdoors', name: 'Outdoors & Recreation' },
    { slug: 'pets', name: 'Pets & Animals' },
    { slug: 'professional', name: 'Professional Services' },
    { slug: 'real_estate', name: 'Real Estate' },
    { slug: 'religious', name: 'Religious Organizations' },
    { slug: 'rv_camping', name: 'RV & Camping' },
    { slug: 'shopping', name: 'Shopping & Retail' },
    { slug: 'transportation', name: 'Transportation' },
    { slug: 'other', name: 'Other' },
  ];
}

// ============================================
// CONTENT DRAFTS - For Universal Add System
// ============================================

export interface ContentDraft {
  id: string;
  user_id: string;
  status: string;
  current_step: number;
  latitude: number | null;
  longitude: number | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  country: string | null;
  formatted_address: string | null;
  content_type: string | null;
  content_subtype: string | null;
  data: Record<string, any>;
  photos: string[];
  cover_photo: string | null;
  created_at: string;
  updated_at: string;
  remind_later_until: string | null;
}

export interface CreateDraftInput {
  user_id: string;
  latitude: number;
  longitude: number;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  formatted_address?: string;
}

// Create a new draft
export async function createDraft(input: CreateDraftInput): Promise<ContentDraft | null> {
  const sql = getSupabaseDb();
  if (!sql) return null;
  
  try {
    const result = await sql<ContentDraft[]>`
      INSERT INTO content_drafts (
        user_id, status, current_step, latitude, longitude,
        address_line1, address_line2, city, region, postal_code,
        country, formatted_address, data, photos
      ) VALUES (
        ${input.user_id}, 'draft_location', 1, ${input.latitude}, ${input.longitude},
        ${input.address_line1 || null}, ${input.address_line2 || null},
        ${input.city || null}, ${input.region || null}, ${input.postal_code || null},
        ${input.country || null}, ${input.formatted_address || null},
        '{}', '{}'
      )
      RETURNING *
    `;
    return result[0] || null;
  } catch (error) {
    console.error("[Supabase] Create draft error:", error);
    return null;
  }
}

// Get active draft for user
export async function getActiveDraft(userId: string): Promise<ContentDraft | null> {
  const sql = getSupabaseDb();
  if (!sql) return null;
  
  try {
    const result = await sql<ContentDraft[]>`
      SELECT * FROM content_drafts
      WHERE user_id = ${userId}
        AND status != 'submitted'
        AND (remind_later_until IS NULL OR remind_later_until < NOW())
      ORDER BY updated_at DESC
      LIMIT 1
    `;
    return result[0] || null;
  } catch (error) {
    console.error("[Supabase] Get active draft error:", error);
    return null;
  }
}

// Delete draft
export async function deleteDraft(id: string, userId: string): Promise<boolean> {
  const sql = getSupabaseDb();
  if (!sql) return false;
  
  try {
    await sql`
      DELETE FROM content_drafts
      WHERE id = ${id} AND user_id = ${userId}
    `;
    return true;
  } catch (error) {
    console.error("[Supabase] Delete draft error:", error);
    return false;
  }
}
