export default function Home() {
  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-900">

      {/* ZONE B — Priority Rail */}
      <aside className="w-80 border-r bg-white p-4">
        <h2 className="text-lg font-semibold">Priority</h2>
        <div className="mt-4 space-y-4 text-sm">
          <div>Overdue</div>
          <div>Due Today</div>
          <div>Materials Order By</div>
          <div>Follow-up Emails</div>
          <div>High Risk Issues</div>
        </div>
      </aside>

      {/* ZONE C — Main Area */}
      <div className="flex flex-1 flex-col">

        {/* ZONE A — Top Bar */}
        <header className="flex h-14 items-center justify-between border-b bg-white px-6">
          <div className="text-lg font-semibold">ForgeSiteDiary</div>
          <div className="text-sm text-neutral-500">Operations Board</div>
        </header>

        {/* Job Grid */}
        <main className="flex-1 p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="font-medium">Job Card Example</div>
              <div className="mt-2 text-sm text-neutral-500">
                Main Contractor
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}
