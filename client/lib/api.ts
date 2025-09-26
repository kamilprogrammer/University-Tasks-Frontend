export type TaskStatus = "pending" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  // Optional timestamps (API may or may not return these)
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Student {
  id: string;
  name: string;
  email?: string | null;
  tasks: Task[];
}

export interface DoctorResponse {
  id: string;
  name: string;
  doctor_students: { students: Student }[];
}

const API_BASE = "https://university-tasks.onrender.com";

export async function fetchDoctor(doctorId: string): Promise<DoctorResponse> {
  const res = await fetch(`${API_BASE}/doctors/${doctorId}`);
  if (!res.ok) throw new Error(`Failed to fetch doctor: ${res.status}`);
  return (await res.json()) as DoctorResponse;
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/status/${status}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(`Failed to update task status: ${res.status}`);
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
