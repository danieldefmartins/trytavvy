import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { supabaseAdmin } from "../supabaseAuth";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get the Authorization header or cookie
    const authHeader = opts.req.headers.authorization;
    const accessToken = authHeader?.replace("Bearer ", "");

    if (accessToken) {
      // Verify the Supabase JWT token
      const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(accessToken);
      
      if (!error && supabaseUser) {
        // Get or create user in our database
        user = await db.getUserByOpenId(supabaseUser.id);
        
        if (!user) {
          // Create user if they don't exist
          await db.upsertUser({
            openId: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || null,
            email: supabaseUser.email ?? null,
            loginMethod: "supabase",
            lastSignedIn: new Date(),
          });
          user = await db.getUserByOpenId(supabaseUser.id);
        } else {
          // Update last signed in
          await db.upsertUser({
            openId: user.openId,
            lastSignedIn: new Date(),
          });
        }
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.error("[Auth] Error authenticating request:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
