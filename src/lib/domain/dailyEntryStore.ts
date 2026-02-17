import { dailyEntries } from '@/lib/domain/devStore';
import { nowISO, todayLocalDate } from '@/lib/domain/dates';
import { DailyEntry } from '@/types/dailyEntry';
import { uuid } from '@/lib/domain/uuid';

const STORAGE_KEY = 'fsd_dailyEntries_v1';
let loaded = false;

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function ensureLoaded() {
  if (loaded) return;
  loaded = true;

  if (!canUseStorage()) return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      dailyEntries.splice(0, dailyEntries.length, ...(parsed as DailyEntry[]));
    }
  } catch {
    // ignore bad storage
  }
}

function save() {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dailyEntries));
  } catch {
    // ignore storage quota/errors
  }
}

export function getOrCreateEntry(jobId: string, date: string): DailyEntry {
  ensureLoaded();

  const existing = dailyEntries.find((e) => e.jobId === jobId && e.date === date);
  if (existing) return existing;

  const created: DailyEntry = {
    id: uuid(),
    jobId,
    date,
    labourSummary: '',
    materialsSummary: '',
    issuesSummary: '',
    createdAt: nowISO(),
  };

  dailyEntries.push(created);
  save();
  return created;
}

export function getOrCreateTodayEntry(jobId: string): DailyEntry {
  return getOrCreateEntry(jobId, todayLocalDate());
}

export function listJobEntryDates(jobId: string): string[] {
  ensureLoaded();
  return dailyEntries
    .filter((e) => e.jobId === jobId)
    .map((e) => e.date)
    .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)); // desc
}

export function findMostRecentBefore(jobId: string, date: string): DailyEntry | undefined {
  ensureLoaded();

  const candidates = dailyEntries
    .filter((e) => e.jobId === jobId && e.date < date)
    .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0)); // desc

  return candidates[0];
}

export function updateDailyEntry(id: string, patch: Partial<DailyEntry>): DailyEntry | undefined {
  ensureLoaded();

  const idx = dailyEntries.findIndex((e) => e.id === id);
  if (idx < 0) return undefined;

  dailyEntries[idx] = { ...dailyEntries[idx], ...patch };
  save();
  return dailyEntries[idx];
}