import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Student, TaskStatus } from "@/lib/api";
import { useEffect } from "react";
import { Checkbox } from "./ui/checkbox";

interface Props {
  students: Student[];
  onToggle: (taskId: string, next: TaskStatus) => void;
  all: boolean;
}

const statusStyles: Record<TaskStatus, { text: string; className: string }> = {
  pending: { text: "Pending", className: "text-[#F59E0B] bg-[#F59E0B]/10" },
  done: { text: "Done", className: "text-[#10B981] bg-[#10B981]/10" },
};

const exportToExcel = (students: Student[]) => {
  // Prepare data for Excel
  const data = students.map((student) => ({
    ID: student.unique_id,
    "Student Name": student.name,
    Professor: student.professorName,
    "Discuss 202520 Plan": student.tasks[0]?.status === "done" ? "Yes" : "No",
    "Explain At-Risk to student":
      student.tasks[1]?.status === "done" ? "Yes" : "No",
    "Record Student Feedback":
      student.tasks[2]?.status === "done" ? "Yes" : "No",
  }));

  // Create a new workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Student Tasks");

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, "student_tasks.xlsx");
};

export default function TasksTable({ students, onToggle, all }: Props) {
  useEffect(() => {
    console.log(students, all);
  });
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/60">
              <TableHead className="text-[#6B7280]">Student ID</TableHead>
              <TableHead className="text-[#6B7280]">Student Name</TableHead>
              {all && (
                <TableHead className="text-[#6B7280]">Professor Name</TableHead>
              )}
              <TableHead className="text-[#6B7280]">
                Discuss 202520 plan with student
              </TableHead>
              <TableHead className="text-[#6B7280]">
                Explain At-Risk to student
              </TableHead>
              <TableHead className="text-[#6B7280]">
                Record student feedback
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-slate-500"
                >
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((s) => {
                console.log(s);
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
                    {all && (
                      <TableCell className="text-slate-600">
                        {s.professorName}
                      </TableCell>
                    )}
                    <TableCell className="text-slate-600">
                      <span
                        className={`pointer-events-auto inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium ${statusStyles[s.tasks[0]?.status || "pending"].className}`}
                      >
                        <Checkbox
                          checked={s.tasks[0]?.status === "done"}
                          className={`border-0 pointer-events-auto data-[state=checked]:bg-[#10B981] data-[state=unchecked]:bg-[#F59E0B] ${s.tasks[0]?.status === "done" ? "bg-[#10B981]" : "bg-[#F59E0B]"}`}
                          color={
                            s.tasks[0]?.status === "done"
                              ? "#10B981"
                              : "#F59E0B"
                          }
                          onCheckedChange={() => {
                            if (!all) {
                              onToggle(
                                s.tasks.find(
                                  (t) =>
                                    t.student_id === s.id &&
                                    t.id === s.tasks[0].id,
                                )?.id,
                                next(
                                  s.tasks.find(
                                    (t) =>
                                      t.student_id === s.id &&
                                      t.id === s.tasks[0].id,
                                  )?.id,
                                ),
                              );
                            }
                          }}
                        />

                        {s.tasks[0]?.title || "Null"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <span
                        className={`pointer-events-auto inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium ${statusStyles[s.tasks[1]?.status || "pending"].className}`}
                      >
                        <Checkbox
                          checked={s.tasks[1]?.status === "done"}
                          className={`border-0 pointer-events-auto data-[state=checked]:bg-[#10B981] data-[state=unchecked]:bg-[#F59E0B] ${s.tasks[1]?.status === "done" ? "bg-[#10B981]" : "bg-[#F59E0B]"}`}
                          color={
                            s.tasks[1]?.status === "done"
                              ? "#10B981"
                              : "#F59E0B"
                          }
                          onCheckedChange={() => {
                            if (!all) {
                              onToggle(
                                s.tasks.find(
                                  (t) =>
                                    t.student_id === s.id &&
                                    t.id === s.tasks[1].id,
                                )?.id,
                                next(
                                  s.tasks.find(
                                    (t) =>
                                      t.student_id === s.id &&
                                      t.id === s.tasks[1].id,
                                  )?.id,
                                ),
                              );
                            }
                          }}
                        />
                        {s.tasks[1]?.title || "Null"}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <span
                        className={`inline-flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium ${statusStyles[s.tasks[2]?.status || "pending"].className}`}
                      >
                        <Checkbox
                          checked={s.tasks[2]?.status === "done"}
                          className={`border-0 pointer-events-auto data-[state=checked]:bg-[#10B981] data-[state=unchecked]:bg-[#F59E0B] ${s.tasks[2]?.status === "done" ? "bg-[#10B981]" : "bg-[#F59E0B]"}`}
                          color={
                            s.tasks[2]?.status === "done"
                              ? "#10B981"
                              : "#F59E0B"
                          }
                          onCheckedChange={() => {
                            if (!all) {
                              onToggle(
                                s.tasks.find(
                                  (t) =>
                                    t.student_id === s.id &&
                                    t.id === s.tasks[2].id,
                                )?.id,
                                next(
                                  s.tasks.find(
                                    (t) =>
                                      t.student_id === s.id &&
                                      t.id === s.tasks[2].id,
                                  )?.id,
                                ),
                              );
                            }
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
    </div>
  );
}
