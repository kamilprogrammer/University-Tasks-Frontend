import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DoctorResponse, StudentWithTasks, TaskStatus } from "@/lib/api";
import { formatDate } from "@/lib/api";

interface Props {
  student: StudentWithTasks[];
  doctor: DoctorResponse;
  onToggle: (taskId: string, next: TaskStatus) => void;
}

const statusStyles: Record<TaskStatus, { text: string; className: string }> = {
  pending: { text: "Pending", className: "text-[#F59E0B] bg-[#F59E0B]/10" },
  done: { text: "Done", className: "text-[#10B981] bg-[#10B981]/10" },
};

export default function TasksTable({ student, onToggle, doctor }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60">
            <TableHead className="text-[#6B7280]">Student ID</TableHead>
            <TableHead className="text-[#6B7280]">Student Name</TableHead>
            <TableHead className="text-[#6B7280]">Advice #1</TableHead>
            <TableHead className="text-[#6B7280]">Advice #2</TableHead>
            <TableHead className="text-[#6B7280]">Advice #3</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {student.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-10 text-center text-slate-500"
              >
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            student.map((s) => {
              const next = (id: string): TaskStatus =>
                s.tasks.find((t) => t.id === id)?.status === "done"
                  ? "pending"
                  : "done";
              return (
                <TableRow key={s.id} className="transition-colors">
                  <TableCell className="font-medium text-slate-600">
                    {s.unique_id}
                  </TableCell>
                  <TableCell className="font-medium text-slate-600">
                    {s.name}
                  </TableCell>
                  <TableCell
                    onDoubleClick={() => {
                      onToggle(
                        s.tasks.find(
                          (t) =>
                            t.doctor_id === doctor.id &&
                            t.student_id === s.id &&
                            t.id === s.tasks[0].id,
                        )?.id,
                        next(
                          s.tasks.find(
                            (t) =>
                              t.doctor_id === doctor.id &&
                              t.student_id === s.id &&
                              t.id === s.tasks[0].id,
                          )?.id,
                        ),
                      );
                      console.log(
                        s.tasks.find(
                          (t) =>
                            t.doctor_id === doctor.id &&
                            t.student_id === s.id &&
                            t.id === s.tasks[0].id,
                        )?.id,
                      );
                    }}
                    className="text-slate-600"
                  >
                    <span
                      className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium ${statusStyles[s.tasks[0]?.status || "pending"].className}`}
                    >
                      <span
                        className="relative -ml-1 h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            s.tasks[0]?.status === "done"
                              ? "#10B981"
                              : "#F59E0B",
                        }}
                      />
                      {s.tasks[0]?.title || "Null"}
                    </span>
                  </TableCell>
                  <TableCell
                    onDoubleClick={() => {
                      onToggle(
                        s.tasks.find(
                          (t) =>
                            t.doctor_id === doctor.id &&
                            t.student_id === s.id &&
                            t.id === s.tasks[1].id,
                        )?.id,
                        next(
                          s.tasks.find(
                            (t) =>
                              t.doctor_id === doctor.id &&
                              t.student_id === s.id &&
                              t.id === s.tasks[1].id,
                          )?.id,
                        ),
                      );
                      console.log(
                        s.tasks.find(
                          (t) =>
                            t.doctor_id === doctor.id &&
                            t.student_id === s.id &&
                            t.id === s.tasks[1].id,
                        )?.id,
                      );
                    }}
                    className="text-slate-600"
                  >
                    <span
                      className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium ${statusStyles[s.tasks[1]?.status || "pending"].className}`}
                    >
                      <span
                        className="relative -ml-1 h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            s.tasks[1]?.status === "done"
                              ? "#10B981"
                              : "#F59E0B",
                        }}
                      />
                      {s.tasks[1]?.title || "Null"}
                    </span>
                  </TableCell>
                  <TableCell
                    onDoubleClick={() => {
                      onToggle(
                        s.tasks.find(
                          (t) =>
                            t.doctor_id === doctor.id &&
                            t.student_id === s.id &&
                            t.id === s.tasks[2]?.id,
                        )?.id,
                        next(
                          s.tasks.find(
                            (t) =>
                              t.doctor_id === doctor.id &&
                              t.student_id === s.id &&
                              t.id === s.tasks[2]?.id,
                          )?.id,
                        ),
                      );
                      console.log(
                        s.tasks.find(
                          (t) =>
                            t.doctor_id === doctor.id &&
                            t.student_id === s.id &&
                            t.id === s.tasks[2]?.id,
                        )?.id,
                      );
                    }}
                    className="text-slate-600"
                  >
                    <span
                      className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium ${statusStyles[s.tasks[2]?.status || "pending"].className}`}
                    >
                      <span
                        className="relative -ml-1 h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            s.tasks[2]?.status === "done"
                              ? "#10B981"
                              : "#F59E0B",
                        }}
                      />
                      {s.tasks[2]?.title || "Null"}
                    </span>
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
