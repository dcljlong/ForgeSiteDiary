"use client";
import Link from 'next/link';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import { seedJobs } from '@/lib/domain/seedJobs';
import { jobs } from '@/lib/domain/devStore';
import { getOrCreateTodayEntry, updateDailyEntry } from '@/lib/domain/dailyEntryStore';

type Props = {
  params: Promise<{ jobId: string }>;
};

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export default function JobDetailPage({ params }: Props) {
  seedJobs();

  const { jobId } = use(params);
  const job = jobs.find((j) => j.id === jobId);

  const [labourSummary, setLabourSummary] = useState('');
  const [materialsSummary, setMaterialsSummary] = useState('');
  const [issuesSummary, setIssuesSummary] = useState('');

  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const saveTimer = useRef<number | null>(null);

  const canRender = useMemo(() => Boolean(job), [job]);

  // Load (get-or-create) today's entry on mount
  useEffect(() => {
    if (!job) return;

    const entry = getOrCreateTodayEntry(job.id);
    setLabourSummary(entry.labourSummary || '');
    setMaterialsSummary(entry.materialsSummary || '');
    setIssuesSummary(entry.issuesSummary || '');
    setSaveState('idle');
  }, [job?.id]);

  function scheduleSave() {
    if (!job) return;

    setSaveState((s) => (s === 'saving' ? 'saving' : 'dirty'));

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    // Debounce 700ms
    saveTimer.current = window.setTimeout(() => {
      try {
        setSaveState('saving');
        updateDailyEntry(job.id, {
          labourSummary,
          materialsSummary,
          issuesSummary,
        });
        setSaveState('saved');
        setLastSavedAt(new Date().toLocaleTimeString());
      } catch {
        setSaveState('error');
      }
    }, 700);
  }

  function flushSaveNow() {
    if (!job) return;

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    try {
      setSaveState('saving');
      updateDailyEntry(job.id, {
        labourSummary,
        materialsSummary,
        issuesSummary,
      });
      setSaveState('saved');
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch {
      setSaveState('error');
    }
  }

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
    };
  }, []);

  if (!canRender) {
    return (
      <main className="min-h-screen bg-neutral-100 p-8 text-neutral-900">
        <h1 className="text-xl font-semibold">Job not found</h1>
        <p className="mt-2 text-sm text-neutral-600">
          No job with id: <span className="font-mono">{jobId}</span>
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium underline">
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-8 text-neutral-900">
      <div className="mb-6">
        <Link href="/" className="text-sm font-medium underline">
          ← Back
        </Link>

        <div className="mt-3 text-sm text-neutral-500">Job</div>
        <h1 className="text-2xl font-bold tracking-tight">
          {job!.jobNumber} — {job!.name}
        </h1>

        <div className="mt-2 text-sm text-neutral-700">
          <div>
            <span className="font-semibold">Main Contractor:</span> {job!.mainContractor}
          </div>
          <div>
            <span className="font-semibold">Site:</span> {job!.siteAddress}
          </div>
          <div>
            <span className="font-semibold">Stage:</span> {job!.stage}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-8 rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
              Today Entry
            </h2>

            <div className="text-xs text-neutral-600">
              {saveState === 'idle' && <span>Ready</span>}
              {saveState === 'dirty' && <span>Unsaved changes</span>}
              {saveState === 'saving' && <span>Saving…</span>}
              {saveState === 'saved' && (
                <span>Saved{lastSavedAt ? ` @ ${lastSavedAt}` : ''}</span>
              )}
              {saveState === 'error' && (
                <span className="text-red-600">Save failed</span>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Labour summary
              </label>
              <textarea
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                rows={4}
                value={labourSummary}
                onChange={(e) => {
                  setLabourSummary(e.target.value);
                  scheduleSave();
                }}
                onBlur={flushSaveNow}
                placeholder="Who was on site, hours, key work completed…"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Materials summary
              </label>
              <textarea
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                rows={4}
                value={materialsSummary}
                onChange={(e) => {
                  setMaterialsSummary(e.target.value);
                  scheduleSave();
                }}
                onBlur={flushSaveNow}
                placeholder="Deliveries, orders placed, shortages, backorders…"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Issues / blockers
              </label>
              <textarea
                className="mt-2 w-full rounded-md border border-neutral-300 bg-white p-3 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                rows={4}
                value={issuesSummary}
                onChange={(e) => {
                  setIssuesSummary(e.target.value);
                  scheduleSave();
                }}
                onBlur={flushSaveNow}
                placeholder="RFIs, access constraints, variations, delays, H&S…"
              />
            </div>
          </div>
        </section>

        <aside className="col-span-4 rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Job Actions (next)
          </h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-600">
            <li>Add task</li>
            <li>Add material order</li>
            <li>Add issue</li>
            <li>Add follow-up email</li>
          </ul>

          <button
            className="mt-6 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            onClick={flushSaveNow}
            type="button"
          >
            Save now
          </button>
        </aside>
      </div>
    </main>
  );
}


