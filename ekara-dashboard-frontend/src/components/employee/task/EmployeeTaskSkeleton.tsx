"use client";

/* ========================= Constants ========================= */

const SIDEBAR_ITEM_COUNT = 7;
const CHAT_MESSAGE_COUNT = 6;

const SIDEBAR_ITEMS = Array.from(
  { length: SIDEBAR_ITEM_COUNT },
  (_, index) => index
);

const CHAT_MESSAGES = Array.from(
  { length: CHAT_MESSAGE_COUNT },
  (_, index) => index
);

/* ========================= Component ========================= */

export default function EmployeeTaskSkeleton() {
  return (
    <div
      className="w-full animate-pulse"
      aria-hidden="true"
    >
      <div
        className="
          grid
          min-h-[calc(100vh-180px)]
          grid-cols-1
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          lg:grid-cols-[280px_minmax(0,1fr)_320px]
        "
      >
        {/* =====================================================
            LEFT TASK SIDEBAR
        ====================================================== */}

        <aside className="hidden border-r border-slate-200 lg:block">
          {/* Sidebar Header */}

          <div className="border-b border-slate-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-5 w-24 rounded-md bg-slate-200" />

              <div className="h-8 w-20 rounded-lg bg-slate-200" />
            </div>

            {/* Search */}

            <div className="h-10 w-full rounded-xl bg-slate-100" />

            {/* Filters */}

            <div className="mt-3 flex gap-2">
              <div className="h-7 w-16 rounded-lg bg-slate-100" />

              <div className="h-7 w-16 rounded-lg bg-slate-100" />

              <div className="h-7 w-16 rounded-lg bg-slate-100" />
            </div>
          </div>

          {/* Task List */}

          <div className="divide-y divide-slate-100">
            {SIDEBAR_ITEMS.map((item) => (
              <div
                key={item}
                className="flex gap-3 p-4"
              >
                {/* Employee Avatar */}

                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />

                {/* Task Content */}

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-3.5 w-28 rounded bg-slate-200" />

                    <div className="h-3 w-10 rounded bg-slate-100" />
                  </div>

                  <div className="h-3 w-36 rounded bg-slate-100" />

                  <div className="flex items-center justify-between gap-2">
                    <div className="h-5 w-16 rounded-full bg-slate-100" />

                    <div className="h-5 w-5 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* =====================================================
            CENTER TASK CHAT
        ====================================================== */}

        <section className="flex min-h-[650px] min-w-0 flex-col">
          {/* Chat Header */}

          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {/* Employee Avatar */}

                <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />

                {/* Employee Information */}

                <div className="min-w-0 space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-200" />

                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
              </div>

              {/* Header Action */}

              <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-100" />
            </div>

            {/* Task Information */}

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <div className="h-4 w-52 max-w-full rounded bg-slate-200" />

                <div className="h-3 w-36 max-w-full rounded bg-slate-100" />
              </div>

              <div className="flex shrink-0 gap-2">
                <div className="h-6 w-20 rounded-full bg-slate-100" />

                <div className="h-6 w-16 rounded-full bg-slate-100" />
              </div>
            </div>
          </div>

          {/* Chat Messages */}

          <div className="flex-1 space-y-5 overflow-hidden p-5">
            {CHAT_MESSAGES.map((item) => {
              const isEmployee = item % 3 === 1;

              return (
                <div
                  key={item}
                  className={`flex ${
                    isEmployee
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[75%] flex-col space-y-2 ${
                      isEmployee
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    {!isEmployee && (
                      <div className="h-3 w-20 rounded bg-slate-100" />
                    )}

                    <div
                      className={`rounded-2xl ${
                        isEmployee
                          ? "rounded-br-md"
                          : "rounded-bl-md"
                      } ${
                        item % 2 === 0
                          ? "h-16 w-64 max-w-full"
                          : "h-12 w-48 max-w-full"
                      } bg-slate-100`}
                    />

                    <div className="h-2.5 w-12 rounded bg-slate-100" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Composer */}

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-end gap-3">
              {/* Attachment Button */}

              <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100" />

              {/* Message Input */}

              <div className="h-11 min-w-0 flex-1 rounded-xl bg-slate-100" />

              {/* Send Button */}

              <div className="h-10 w-20 shrink-0 rounded-xl bg-slate-200" />
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT TASK DETAILS
        ====================================================== */}

        <aside className="hidden border-l border-slate-200 xl:block">
          {/* Details Header */}

          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div className="h-5 w-28 rounded-md bg-slate-200" />

            <div className="h-8 w-8 rounded-lg bg-slate-100" />
          </div>

          {/* Details Content */}

          <div className="space-y-6 p-5">
            {/* Task Title and Description */}

            <div className="space-y-2">
              <div className="h-5 w-52 max-w-full rounded bg-slate-200" />

              <div className="h-3 w-full rounded bg-slate-100" />

              <div className="h-3 w-4/5 rounded bg-slate-100" />
            </div>

            {/* Status */}

            <div className="space-y-2">
              <div className="h-3 w-14 rounded bg-slate-100" />

              <div className="h-10 w-full rounded-xl bg-slate-100" />
            </div>

            {/* Assignment */}

            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-slate-100" />

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                {/* Avatar */}

                <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200" />

                {/* Employee Information */}

                <div className="min-w-0 space-y-2">
                  <div className="h-3.5 w-28 rounded bg-slate-200" />

                  <div className="h-2.5 w-20 rounded bg-slate-100" />
                </div>
              </div>
            </div>

            {/* Client */}

            <div className="space-y-2">
              <div className="h-3 w-12 rounded bg-slate-100" />

              <div className="h-10 w-full rounded-xl bg-slate-100" />
            </div>

            {/* Schedule */}

            <div className="space-y-3">
              <div className="h-3 w-20 rounded bg-slate-100" />

              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 rounded-xl bg-slate-100" />

                <div className="h-12 rounded-xl bg-slate-100" />
              </div>
            </div>

            {/* Progress */}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-14 rounded bg-slate-100" />

                <div className="h-3 w-8 rounded bg-slate-200" />
              </div>

              <div className="h-2 w-full rounded-full bg-slate-100" />
            </div>

            {/* Task Information */}

            <div className="space-y-3 border-t border-slate-100 pt-5">
              <div className="h-3 w-28 rounded bg-slate-100" />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="h-3 w-16 rounded bg-slate-100" />

                  <div className="h-3 w-20 rounded bg-slate-200" />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="h-3 w-16 rounded bg-slate-100" />

                  <div className="h-3 w-24 rounded bg-slate-200" />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="h-3 w-20 rounded bg-slate-100" />

                  <div className="h-3 w-16 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}