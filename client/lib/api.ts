export type TaskStatus = "pending" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  student_id: string;
  // Optional timestamps (API may or may not return these)
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Student {
  id: string;
  name: string;
  doctor_id: string;
  email?: string | null;
  tasks: Task[];
  unique_id: string;
}

export interface DoctorResponse {
  id: string;
  name: string;
  students: Student[];
}

const API_BASE = "https://university-tasks.onrender.com";

export async function fetchDoctor(doctorId: string): Promise<DoctorResponse> {
  const res = await fetch(`${API_BASE}/doctors/${doctorId}`);
  if (!res.ok) throw new Error(`Failed to fetch doctor: ${res.status}`);
  return (await res.json()) as DoctorResponse;
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/status/${status}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(`Failed to update task status: ${res.status}`);
}

export interface CreateTaskData {
  title: string;
  description: string;
  student_id: string;
  doctor_id: string;
}

export async function createTask(data: CreateTaskData): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);
  return res.json();
}

export function formatDate(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
