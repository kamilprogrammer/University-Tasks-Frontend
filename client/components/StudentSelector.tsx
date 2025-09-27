import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Student } from "@/lib/api";
import { ChevronDown } from "lucide-react";

interface Props {
  students: Student[];
  value?: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function StudentSelector({
  students,
  value,
  onChange,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const selected = students.find((s) => s.id === value);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div ref={ref} className={cn("w-full md:w-96", className)}>
      <label className="mb-2 block text-sm font-medium text-slate-600">
        Select student
      </label>
      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <div className="flex flex-col truncate">
            {selected ? (
              <>
                <span className="text-sm font-medium text-slate-900 truncate">
                  {selected.name}
                </span>
                {selected.email ? (
                  <span className="text-xs text-slate-500 truncate">
                    {selected.email}
                  </span>
                ) : null}
              </>
            ) : (
              <span className="text-sm text-slate-500">Choose a student</span>
            )}
          </div>
          <ChevronDown className={"h-5 w-5 text-slate-400"} />
        </button>

        <div
          role="listbox"
          aria-activedescendant={value}
          className={`absolute z-40 mt-2 max-h-64 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-2 shadow-lg transition-all ${open ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-95"}`}
        >
          {students.map((s) => (
            <button
              key={s.id}
              role="option"
              aria-selected={s.id === value}
              onClick={() => {
                onChange(s.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50",
                s.id === value ? "bg-slate-50" : "",
              )}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900">
                  {s.name}
                </span>
                {s.email ? (
                  <span className="text-xs text-slate-500">{s.email}</span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
