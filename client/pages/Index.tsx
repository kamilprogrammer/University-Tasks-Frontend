import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import StudentSelector from "@/components/StudentSelector";
import TasksTable from "@/components/TasksTable";
import {
  type DoctorResponse,
  fetchDoctor,
  type Student,
  type TaskStatus,
  updateTaskStatus,
} from "@/lib/api";

export default function DoctorPage() {
  const { doctorUuid } = useParams<{ doctorUuid: string }>();
  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorUuid) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const d = await fetchDoctor(doctorUuid); // dynamic fetch
        if (!mounted) return;
        setDoctor(d);
        const list = (d.doctor_students || []).map((ds) => ds.students);
        setStudents(list);
        setSelectedStudentId((prev) => prev ?? list[0]?.id);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [doctorUuid]);

  const selectedStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  const handleToggle = async (taskId: string, next: TaskStatus) => {
    if (!selectedStudent) return;
    const prev = selectedStudent.tasks.slice();
    const optimistic = selectedStudent.tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: next, updated_at: new Date().toISOString() }
        : t,
    );
    setStudents((arr) =>
      arr.map((s) =>
        s.id === selectedStudent.id ? { ...s, tasks: optimistic } : s,
      ),
    );
    try {
      await updateTaskStatus(taskId, next);
    } catch (e) {
      setStudents((arr) =>
        arr.map((s) =>
          s.id === selectedStudent.id ? { ...s, tasks: prev } : s,
        ),
      );
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Academic Mission Control System
            </h1>
            {doctor ? (
              <p className="mt-[0.5px] text-sm text-slate-500">
                Dr. {doctor.name}
              </p>
            ) : null}
          </div>
        </header>

        <div className="mb-6">
          <div className="mx-0 w-full">
            <StudentSelector
              students={students}
              value={selectedStudentId}
              onChange={setSelectedStudentId}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-slate-500 shadow-sm">
            Loading...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <TasksTable
              tasks={selectedStudent?.tasks ?? []}
              onToggle={handleToggle}
            />
          </div>
        )}
      </div>
    </div>
  );
}
