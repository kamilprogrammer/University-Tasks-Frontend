import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Task, TaskStatus } from "@/lib/api";
import { formatDate } from "@/lib/api";

interface Props {
  tasks: Task[];
  onToggle: (taskId: string, next: TaskStatus) => void;
}

const statusStyles: Record<TaskStatus, { text: string; className: string } > = {
  pending: { text: "Pending", className: "text-[#F59E0B] bg-[#F59E0B]/10" },
  done: { text: "Done", className: "text-[#10B981] bg-[#10B981]/10" },
};

export default function TasksTable({ tasks, onToggle }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60">
            <TableHead className="text-[#6B7280]">Title</TableHead>
            <TableHead className="text-[#6B7280]">Description</TableHead>
            <TableHead className="text-[#6B7280]">Status</TableHead>
            <TableHead className="text-[#6B7280]">Created at</TableHead>
            <TableHead className="text-right text-[#6B7280]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-slate-500">No tasks found.</TableCell>
            </TableRow>
          ) : (
            tasks.map((t) => {
              const next: TaskStatus = t.status === "done" ? "pending" : "done";
              const nextLabel = t.status === "done" ? "Mark Pending" : "Mark Done";

              const isMarkDoneAction = next === "done";

              return (
                <TableRow key={t.id} className="transition-colors">
                  <TableCell className="font-medium text-slate-800">{t.title}</TableCell>
                  <TableCell className="text-slate-600">{t.description}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[t.status].className}`}>
                      <span
                        className="relative -ml-1 h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: t.status === "done" ? "#10B981" : "#F59E0B",
                        }}
                      />
                      {statusStyles[t.status].text}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">{formatDate(t.created_at)}</TableCell>
                  <TableCell className="text-right">
                    {isMarkDoneAction ? (
                      <Button
                        type="button"
                        onClick={() => onToggle(t.id, "done")}
                        className={
                          "inline-flex items-center gap-2 rounded-md px-4 py-2 font-medium text-sm bg-[#10B981] text-white shadow-sm transition-colors hover:bg-[#0e9f6f] active:bg-[#0c8f60] focus:outline-none focus:ring-2 focus:ring-offset-2"
                        }
                      >
                        <Check className="h-4 w-4" />
                        <span>Mark Done</span>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="inline-flex items-center gap-2 rounded-md px-3 py-2 font-medium text-sm"
                        onClick={() => onToggle(t.id, "pending")}
                      >
                        Mark Pending
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
