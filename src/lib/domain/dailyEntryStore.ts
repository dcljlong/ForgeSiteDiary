import { dailyEntries } from '@/lib/domain/devStore';
import { nowISO, todayLocalDate } from '@/lib/domain/dates';
import { DailyEntry } from '@/types/dailyEntry';

export function getOrCreateTodayEntry(jobId: string): DailyEntry {
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
  return created;
}

export function updateDailyEntry(id: string, patch: Partial<DailyEntry>): DailyEntry | undefined {
  const idx = dailyEntries.findIndex((e) => e.id === id);
  if (idx < 0) return undefined;

  dailyEntries[idx] = { ...dailyEntries[idx], ...patch };
  return dailyEntries[idx];
}
