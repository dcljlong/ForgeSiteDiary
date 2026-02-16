/*
  TEMP DEV DATA STORE
  This will be replaced by Supabase in M8.
*/

import { Job, DayEntry, Item } from '@/types/domain';
import { DailyEntry } from '@/types/dailyEntry';

export const jobs: Job[] = [];
export const dayEntries: DayEntry[] = [];   // legacy placeholder (kept for now)
export const dailyEntries: DailyEntry[] = []; // M6 starts using this
export const items: Item[] = [];