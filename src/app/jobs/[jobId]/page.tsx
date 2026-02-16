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

  const { jobId } = (use(params) as { jobId: string });
  const job = jobs.find((j) => j.id === jobId);

  const [labourSummary, setLabourSummary] = useState('');
  const [materialsSummary, setMaterialsSummary] = useState('');
  const [issuesSummary, setIssuesSummary] = useState('');

  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const saveTimer = useRef<number | null>(null);

  const todayEntry = useMemo(() => getOrCreateTodayEntry(jobId), [jobId]);

  useEffect(() => {
    setLabourSummary(todayEntry.labourSummary ?? '');
    setMaterialsSummary(todayEntry.materialsSummary ?? '');
    setIssuesSummary(todayEntry.issuesSummary ?? '');
    setSaveState('idle');
    setLastSavedAt(null);
  }, [todayEntry.id]);

  function markDirty() {
    setSaveState((s) => (s === 'saving' ? 'saving' : 'dirty'));
  }

  function saveNow() {
    try {
      setSaveState('saving');
      const updated = updateDailyEntry(todayEntry.id, {
        labourSummary,
        materialsSummary,
        issuesSummary,
      });
      if (!updated) throw new Error('updateDailyEntry returned undefined');
      setSaveState('saved');
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch {
      setSaveState('error');
    }
  }

  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    if (saveState !== 'dirty') return;

    saveTimer.current = window.setTimeout(() => {
      saveNow();
    }, 900);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveState, labourSummary, materialsSummary, issuesSummary]);

  if (!job) {
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
          &lt;- Back
        </Link>

        <div className="mt-3 text-sm text-neutral-500">Job</div>
        <h1 className="text-2xl font-bold tracking-tight">
          {job.jobNumber} - {job.name}
        </h1>

        <div className="mt-2 text-sm text-neutral-700">
          <div><span className="font-semibold">Main Contractor:</span> {job.mainContractor}</div>
          <div><span className="font-semibold">Site:</span> {job.siteAddress}</div>
          <div><span className="font-semibold">Stage:</span> {job.stage}</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-8 rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
              Today Entry
            </h2>

            <div className="text-xs text-neutral-500">
              {saveState === 'idle' && 'Ready'}
              {saveState === 'dirty' && 'Unsaved'}
              {saveState === 'saving' && 'Saving...'}
              {saveState === 'saved' && `Saved ${lastSavedAt ?? ''}`.trim()}
              {saveState === 'error' && 'Save failed'}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Labour Summary
              </div>
              <textarea
                className="h-28 w-full rounded-md border border-neutral-300 p-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/20"
                placeholder="Who was on site, hours, key work completed..."
                value={labourSummary}
                onChange={(e) => { setLabourSummary(e.target.value); markDirty(); }}
              />
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Materials Summary
              </div>
              <textarea
                className="h-28 w-full rounded-md border border-neutral-300 p-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/20"
                placeholder="Deliveries, orders placed, shortages, backorders..."
                value={materialsSummary}
                onChange={(e) => { setMaterialsSummary(e.target.value); markDirty(); }}
              />
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Issues / Blockers
              </div>
              <textarea
                className="h-28 w-full rounded-md border border-neutral-300 p-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/20"
                placeholder="RFIs, access constraints, variations, delays, H&S..."
                value={issuesSummary}
                onChange={(e) => { setIssuesSummary(e.target.value); markDirty(); }}
              />
            </div>
          </div>
        </section>

        <aside className="col-span-4 rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Job Actions (Next)
          </h2>

          <ul className="mb-6 list-disc pl-5 text-sm text-neutral-600">
            <li>Add task</li>
            <li>Add material order</li>
            <li>Add issue</li>
            <li>Add follow-up email</li>
          </ul>

          <button
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            onClick={() => saveNow()}
            type="button"
          >
            Save now
          </button>
        </aside>
      </div>
    </main>
  );
}

