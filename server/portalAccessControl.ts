/**
 * Portal Access Control Middleware
 * 
 * Ensures users can only access features for their subscribed portal type
 */

import { TRPCError } from '@trpc/server';
import type { Context } from './_core/context';

export type PortalType = 'free' | 'pros' | 'realtor' | 'onthego';

/**
 * Check if user has access to a specific portal
 */
export function requirePortalAccess(allowedPortals: PortalType[]) {
  return async (ctx: Context) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this feature',
      });
    }

    // Get user's portal type from their profile
    const userPortalType = ctx.user.portal_type as PortalType || 'free';

    // Check if user's portal type is in the allowed list
    if (!allowedPortals.includes(userPortalType)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `This feature is not available for your subscription type. Please upgrade to access ${allowedPortals.join(' or ')} features.`,
      });
    }

    return ctx;
  };
}

/**
 * Check if user has an active paid subscription
 */
export function requirePaidSubscription(ctx: Context) {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }

  const subscriptionStatus = ctx.user.subscription_status;
  const isPro = ctx.user.is_pro;

  if (!isPro || subscriptionStatus !== 'active') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'This feature requires an active paid subscription',
    });
  }

  return ctx;
}

/**
 * Get portal-specific features and limits
 */
export function getPortalFeatures(portalType: PortalType) {
  const features = {
    free: {
      maxPlaces: 0,
      canGoLive: false,
      canSchedule: false,
      canMessage: false,
      canViewAnalytics: false,
      canUploadPhotos: false,
    },
    pros: {
      maxPlaces: 10,
      canGoLive: false,
      canSchedule: true,
      canMessage: true,
      canViewAnalytics: true,
      canUploadPhotos: true,
      canAccessCRM: true,
      canSponsorSearches: false,
    },
    realtor: {
      maxPlaces: 10,
      canGoLive: false,
      canSchedule: true,
      canMessage: true,
      canViewAnalytics: true,
      canUploadPhotos: true,
      canAccessCRM: true,
      canSponsorSearches: false,
    },
    onthego: {
      maxPlaces: 1,
      canGoLive: true,
      canSchedule: true,
      canMessage: true,
      canViewAnalytics: true,
      canUploadPhotos: true,
      canAccessCRM: false,
      canSponsorSearches: false,
    },
  };

  return features[portalType] || features.free;
}

/**
 * Check if a place should be visible in the app (only paid places)
 */
export function isPlaceVisibleInApp(place: any): boolean {
  // Only show places from users with active paid subscriptions
  if (!place.owner_user_id) {
    return false; // Places without owners are not visible
  }

  // Check if the place owner has an active subscription
  const ownerProfile = place.owner_profile;
  if (!ownerProfile) {
    return false;
  }

  const isPaid = ownerProfile.is_pro === true;
  const isActive = ownerProfile.subscription_status === 'active';
  const hasPortalType = ['pros', 'realtor', 'onthego'].includes(ownerProfile.portal_type);

  return isPaid && isActive && hasPortalType;
}

/**
 * Filter places to only show paid places
 */
export function filterPaidPlacesOnly(places: any[]): any[] {
  return places.filter(place => isPlaceVisibleInApp(place));
}
