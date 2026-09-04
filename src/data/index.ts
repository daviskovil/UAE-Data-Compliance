/**
 * The single data-access entry point for the app.
 *
 * Swap the implementation here when moving off local seed data:
 *
 *   import { SupabaseRepository } from "./supabase-repository";
 *   export const db: DataRepository = new SupabaseRepository();
 */

import type { DataRepository } from "./repository";
import { LocalRepository } from "./repository";

export const db: DataRepository = new LocalRepository();

export type { DataRepository } from "./repository";
