import { dailyEntries } from '@/lib/domain/devStore';
import { nowISO, todayLocalDate } from '@/lib/domain/dates';
import { DailyEntry } from '@/types/dailyEntry';

const STORAGE_KEY = 'fsd_dailyEntries_v1';

let loaded = false;

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function ensureLoaded() {
  if (loaded) return;
  loaded = true;

  if (!isBrowser()) return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    // Replace in-memory array contents in-place
    dailyEntries.length = 0;
    for (const e of parsed) {
      // Minimal shape check (keep tolerant for now)
      if (e && typeof e === 'object' && typeof e.id === 'string' && typeof e.jobId === 'string' && typeof e.date === 'string') {
        dailyEntries.push(e as DailyEntry);
      }
    }
  } catch {
    // Ignore corrupted storage
  }
}

function save() {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dailyEntries));
  } catch {
    // Ignore quota / storage errors
  }
}

export function getOrCreateTodayEntry(jobId: string): DailyEntry {
  ensureLoaded();

  const today = todayLocalDate();

  const existing = dailyEntries.find((e) => e.jobId === jobId && e.date === today);
  if (existing) return existing;

  const created: DailyEntry = {
    id: crypto.randomUUID(),
    jobId,
    date: today,
    labourSummary: '',
    materialsSummary: '',
    issuesSummary: '',
    createdAt: nowISO(),
  };

  dailyEntries.push(created);
  save();
  return created;
}

export function updateDailyEntry(id: string, patch: Partial<DailyEntry>): DailyEntry | undefined {
  ensureLoaded();

  const idx = dailyEntries.findIndex((e) => e.id === id);
  if (idx < 0) return undefined;

  dailyEntries[idx] = { ...dailyEntries[idx], ...patch };
  save();
  return dailyEntries[idx];
}