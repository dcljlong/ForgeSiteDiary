"use client";
import Link from "next/link";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { seedJobs } from "@/lib/domain/seedJobs";
import { jobs } from "@/lib/domain/devStore";
import { todayLocalDate } from "@/lib/domain/dates";
import { getOrCreateEntry, listJobEntryDates, updateDailyEntry } from "@/lib/domain/dailyEntryStore";

type Props = {
  params: Promise<{ jobId: string }>;
};

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

function addDaysLocal(ymd: string, days: number): string {
  // Local-date math, no UTC conversion (prevents NZ +13 "next day doesn't change")
  const [y, m, d0] = ymd.split("-").map((n) => Number(n));
  const dt = new Date(y, m - 1, d0); // local midnight
  dt.setDate(dt.getDate() + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function formatNZ(ymd: string): string {
  // Display-only NZ format: dd/MM/yyyy (keeps input type="date" as yyyy-MM-dd)
  if (!ymd) return "";
  const parts = ymd.split("-");
  if (parts.length !== 3) return ymd;
  const y = parts[0], m = parts[1], d = parts[2];
  if (!y || !m || !d) return ymd;
  return d + "/" + m + "/" + y;
}


export default function JobDetailPage({ params }: Props) {
  seedJobs();

  const { jobId } = use(params) as { jobId: string };
  const job = jobs.find((j) => j.id === jobId);

  // Hydration-safe: render nothing dynamic until mounted on client
  const [mounted, setMounted] = useState(false);

  // M7: selected date (YYYY-MM-DD) - set after mount to avoid SSR/client mismatch
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    setSelectedDate(todayLocalDate());
  }, []);

  const entry = useMemo(() => {
    if (!mounted || !selectedDate) return null;
    return getOrCreateEntry(jobId, selectedDate);
  }, [mounted, jobId, selectedDate]);

  const entryDates = useMemo(() => {
    if (!mounted) return [];
    const dates = listJobEntryDates(jobId) ?? [];
    return [...dates].sort(); // ascending YYYY-MM-DD
  }, [mounted, jobId, entry?.id]);

  const [labourSummary, setLabourSummary] = useState("");
  const [materialsSummary, setMaterialsSummary] = useState("");
  const [issuesSummary, setIssuesSummary] = useState("");

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!entry) return;
    setLabourSummary(entry.labourSummary ?? "");
    setMaterialsSummary(entry.materialsSummary ?? "");
    setIssuesSummary(entry.issuesSummary ?? "");
    setSaveState("idle");
    setLastSavedAt(null);
  }, [entry?.id]);

  function markDirty() {
    setSaveState((s) => (s === "saving" ? "saving" : "dirty"));
  }

  function saveNow() {
    if (!entry) return;
    try {
      setSaveState("saving");
      const updated = updateDailyEntry(entry.id, {
        labourSummary,
        materialsSummary,
        issuesSummary,
      });
      if (!updated) throw new Error("updateDailyEntry returned undefined");
      setSaveState("saved");
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch {
      setSaveState("error");
    }
  }

  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    if (saveState !== "dirty") return;

    saveTimer.current = window.setTimeout(() => {
      saveNow();
    }, 900);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveState, labourSummary, materialsSummary, issuesSummary]);

  function gotoToday() {
    setSelectedDate(todayLocalDate());
  }
  function gotoPrevDay() {
    setSelectedDate((d) => addDaysLocal(d, -1));
  }
  function gotoNextDay() {
    setSelectedDate((d) => addDaysLocal(d, 1));
  }
  function gotoPrevSaved() {
    const idx = entryDates.indexOf(selectedDate);
    if (idx > 0) setSelectedDate(entryDates[idx - 1]);
    if (idx === -1 && entryDates.length > 0) setSelectedDate(entryDates[entryDates.length - 1]);
  }
  function gotoNextSaved() {
    const idx = entryDates.indexOf(selectedDate);
    if (idx >= 0 && idx < entryDates.length - 1) setSelectedDate(entryDates[idx + 1]);
  }

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

  // Critical: avoid rendering entry UI until mounted+date+entry exist
  if (!mounted || !selectedDate || !entry) {
    return (
      <main className="min-h-screen bg-neutral-100 p-8 text-neutral-900">
        <Link href="/" className="text-sm font-medium underline">
          &lt;- Back
        </Link>
        <div className="mt-3 text-sm text-neutral-500">Job</div>
        <h1 className="text-2xl font-bold tracking-tight">
          {job.jobNumber} - {job.name}
        </h1>
        <div className="mt-4 text-sm text-neutral-600">Loading entry...</div>
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
          <div>
            <span className="font-semibold">Main Contractor:</span> {job.mainContractor}
          </div>
          <div>
            <span className="font-semibold">Site:</span> {job.siteAddress}
          </div>
          <div>
            <span className="font-semibold">Stage:</span> {job.stage}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-8 rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium hover:bg-neutral-50"
                onClick={gotoPrevDay}
                title="Previous day"
              >
                Prev day
              </button>

              <button
                type="button"
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium hover:bg-neutral-50"
                onClick={gotoNextDay}
                title="Next day"
              >
                Next day
              </button>

              <input
                type="date"
                className="rounded-md border border-neutral-300 px-3 py-2 text-xs"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <button
                type="button"
                className="rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800"
                onClick={gotoToday}
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium hover:bg-neutral-50"
                onClick={gotoPrevSaved}
                title="Jump to previous saved entry date"
              >
                Prev saved
              </button>

              <button
                type="button"
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs font-medium hover:bg-neutral-50"
                onClick={gotoNextSaved}
                title="Jump to next saved entry date"
              >
                Next saved
              </button>

              <div className="text-xs text-neutral-500">
                {saveState === "idle" && "Ready"}
                {saveState === "dirty" && "Unsaved"}
                {saveState === "saving" && "Saving..."}
                {saveState === "saved" && `Saved ${lastSavedAt ?? ""}`.trim()}
                {saveState === "error" && "Save failed"}
              </div>
            </div>
          </div>

          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Entry for {formatNZ(selectedDate)}
          </h2>

          <div className="space-y-5">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Labour Summary
              </div>
              <textarea
                className="h-28 w-full rounded-md border border-neutral-300 p-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/20"
                placeholder="Who was on site, hours, key work completed..."
                value={labourSummary}
                onChange={(e) => {
                  setLabourSummary(e.target.value);
                  markDirty();
                }}
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
                onChange={(e) => {
                  setMaterialsSummary(e.target.value);
                  markDirty();
                }}
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
                onChange={(e) => {
                  setIssuesSummary(e.target.value);
                  markDirty();
                }}
              />
            </div>
          </div>
        </section>

        <aside className="col-span-4 rounded-lg border border-neutral-300 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
            Entry Dates (Saved)
          </h2>

          {entryDates.length === 0 ? (
            <div className="text-sm text-neutral-500">No saved entries yet.</div>
          ) : (
            <div className="max-h-64 space-y-2 overflow-auto pr-1">
              {entryDates
                .slice()
                .reverse()
                .map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={[
                      "w-full rounded-md border px-3 py-2 text-left text-sm",
                      d === selectedDate
                        ? "border-neutral-900 bg-neutral-50 font-semibold"
                        : "border-neutral-300 bg-white hover:bg-neutral-50",
                    ].join(" ")}
                    onClick={() => setSelectedDate(d)}
                  >
                    {formatNZ(d)}
                  </button>
                ))}
            </div>
          )}

          <div className="mt-6">
            <button
              className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              onClick={() => saveNow()}
              type="button"
            >
              Save now
            </button>
          </div>

          <div className="mt-6 text-xs text-neutral-500">
            Note: Entries are stored locally (browser localStorage) for now.
          </div>
        </aside>
      </div>
    </main>
  );
}
