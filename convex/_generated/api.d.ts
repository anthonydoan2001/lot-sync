import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as announcements from "../announcements.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as lots from "../lots.js";
import type * as pallets from "../pallets.js";
import type * as profiles from "../profiles.js";
import type * as workers from "../workers.js";

declare const fullApi: ApiFromModules<{
  announcements: typeof announcements;
  auth: typeof auth;
  http: typeof http;
  lots: typeof lots;
  pallets: typeof pallets;
  profiles: typeof profiles;
  workers: typeof workers;
}>;

export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
