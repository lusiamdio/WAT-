import { CommunitySpace, Message, ProductInfo, Room, StoryStatus, User } from '../types';

/**
 * The client intentionally ships without seeded identities, conversations, media,
 * products, or social content. Data is created by the authenticated user or loaded
 * from the production service; it is never fabricated in the interface.
 */
export const INITIAL_USERS: User[] = [];
export const INITIAL_PRODUCTS: ProductInfo[] = [];
export const INITIAL_ROOMS: Room[] = [];
export const INITIAL_MESSAGES: Record<string, Message[]> = {};
export const INITIAL_STORIES: StoryStatus[] = [];
export const INITIAL_COMMUNITIES: CommunitySpace[] = [];
