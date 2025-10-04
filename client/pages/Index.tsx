import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import TasksTable from "@/components/TasksTable";
import * as XLSX from "xlsx";
import {
  type DoctorResponse,
  fetchDoctor,
  type Student,
  type TaskStatus,
  updateTaskStatus,
  createTask,
  type CreateTaskData,
} from "@/lib/api";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function DoctorPage() {
  const { doctorUuid } = useParams<{ doctorUuid: string }>();
  const [doctor, setDoctor] = useState<DoctorResponse | null>(null);
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Omit<CreateTaskData, "studentId">>({
    title: "",
    description: "",
    doctor_id: "",
    student_id: "",
  });
  type StudentWithProfessor = Student & { professorName: string };
  const [allStudents, setAllStudents] = useState<StudentWithProfessor[]>([]);

  const exportToExcel = (students: Student[]) => {
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

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Data");

    XLSX.writeFile(wb, "Data.xlsx");
  };

  useEffect(() => {
    if (!doctorUuid) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const d = await fetchDoctor(doctorUuid);
        if (!mounted) return;
        console.log(d);
        if (d instanceof Array) {
          const sortDoctors = (doctors: DoctorResponse[]) =>
            doctors.sort((a, b) => (a.name > b.name ? 1 : -1));
          const allStudents = sortDoctors(d).flatMap((doctor) =>
            doctor.students.map((student) => ({
              ...student,
              professorName: doctor.name,
              tasks: student.tasks.sort((a, b) => (a.title > b.title ? 1 : -1)),
            })),
          );
          setAllStudents(allStudents);
        } else {
          setDoctor(d);
          const sortTasks = (students: Student[]) =>
            students.map((student) => ({
              ...student,
              tasks: student.tasks.sort((a, b) =>
                a.title.localeCompare(b.title),
              ),
            }));

          setData(
            sortTasks(
              (d as DoctorResponse).students.sort((a, b) =>
                a.name > b.name ? 1 : -1,
              ),
            ),
          );
        }

        console.log(d);
        setError(null);
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

  const handleToggle = async (taskId: string, next: TaskStatus) => {
    setUpdateLoading(true);
    const prev = data.flatMap((student) => student.tasks);
    const optimistic = data.flatMap((student) =>
      student.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: next, updated_at: new Date().toISOString() }
          : task,
      ),
    );

    try {
      await updateTaskStatus(taskId, next);
      setData((prevData) =>
        prevData.map((student) => ({
          ...student,
          tasks: student.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: next, updated_at: new Date().toISOString() }
              : task,
          ),
        })),
      );
    } catch (e) {
      setData((prevData) =>
        prevData.map((student) => ({
          ...student,
          tasks: prev,
        })),
      );
      console.error(e);
    } finally {
      setUpdateLoading(false);
    }
  };
  /*const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };*/

  return (
    <>
      {updateLoading && <LoadingOverlay />}

      <div className="min-h-screen bg-[hsl(var(--background))] px-4 py-8 md:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Smart Academic Advising System
              </h1>
              {
                <p className="mt-[0.5px] text-sm text-slate-500">
                  {allStudents.length > 0 ? "Admin Page" : ""}
                  {doctor && doctor.name}
                </p>
              }
            </div>
            {/*<Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger asChild>
            <button
            className={`inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${addLoading ? "pointer-events-none opacity-50" : ""}`}
            >
            <PlusIcon className="h-4 w-4" />
            Add Task
            </button>
            </Dialog.Trigger>
            <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">
            Add New Task
            </Dialog.Title>
            <Dialog.Close asChild>
            <button
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
            >
            <X className="h-5 w-5" />
            </button>
            </Dialog.Close>
            </div>
            {/*
            <form onSubmit={handleCreateTask}>
            <div className="mb-4">
            <label
            htmlFor="title"
            className="mb-1 block text-sm font-medium text-slate-700"
            >
                      Title <span className="text-red-500">*</span>
                      </label>
                      <input
                      type="text"
                      id="title"
                      name="title"
                      value={newTask.title}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                      />
                      </div>
                      <div className="mb-6">
                      <label
                      htmlFor="description"
                      className="mb-1 block text-sm font-medium text-slate-700"
                      >
                      Description
                      </label>
                      <textarea
                      id="description"
                      name="description"
                      value={newTask.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      </div>
                      <div className="flex justify-end gap-3">
                      <Dialog.Close asChild>
                      <button
                      type="button"
                      className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                      Cancel
                      </button>
                      </Dialog.Close>
                      <button
                      type="submit"
                      className={`rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${addLoading ? "pointer-events-none opacity-50" : ""}`}
                      disabled={!newTask.title.trim()}
                      >
                      Add Task
                      </button>
                  </div>
                  </form>
                  </Dialog.Content>
                  </Dialog.Portal>
                  </Dialog.Root>*/}
          </header>

          {/*
        <div className="mb-6">
          <div className="mx-0 w-full">
            <StudentSelector
            students={students}
            value={selectedStudentId}
            onChange={setSelectedStudentId}
            />
            </div>
            </div>
            */}
          {loading ? (
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-slate-500 shadow-sm">
              Loading...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          ) : doctor ? (
            <div className="space-y-4">
              <TasksTable all={false} students={data} onToggle={handleToggle} />
            </div>
          ) : allStudents.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="flex space-x-2 justify-center">
                  <Button
                    onClick={() => exportToExcel(allStudents)}
                    className="flex items-center gap-2 bg-[#2185D5] hover:bg-[#186db3]"
                  >
                    <Download className="h-4 w-4" />
                    Export to Excel
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
