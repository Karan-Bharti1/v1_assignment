import { useAuth } from '../context/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

function getAuthHeader(token: string | null): HeadersInit {
  if (token) {
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  }
  return { 'Content-Type': 'application/json' };
}

async function handleResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.error || 'API Error';
    throw new Error(errorMsg);
  }
  return data;
}

export async function loginAPI(email: string, password: string) {
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(res);
}

export async function fetchProfileAPI() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${BACKEND_URL}/api/auth/profile`, {
    headers: getAuthHeader(token)
  });
  return handleResponse(res);
}

export async function fetchEngineers() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BACKEND_URL}/api/engineers`, {
    headers: getAuthHeader(token)
  });
  return handleResponse(res);
}

export async function fetchEngineerCapacity(engineerId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BACKEND_URL}/api/engineers/${engineerId}/capacity`, {
    headers: getAuthHeader(token)
  });
  return handleResponse(res);
}

export async function updateEngineerAPI(engineerId: string, data: Partial<any>) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BACKEND_URL}/api/engineers/${engineerId}`, {
    method: 'PUT',
    headers: getAuthHeader(token),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function fetchProjects() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BACKEND_URL}/api/projects`, {
    headers: getAuthHeader(token)
  });
  return handleResponse(res);
}

export async function createProjectAPI(data: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BACKEND_URL}/api/projects`, {
    method: 'POST',
    headers: getAuthHeader(token),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function fetchAssignmentsForEngineer(engineerId: string) {
  const token = localStorage.getItem('token');
  const url = new URL(`${BACKEND_URL}/api/assignments`);
  url.searchParams.append('engineer', engineerId);
  const res = await fetch(url.toString(), { headers: getAuthHeader(token) });
  return handleResponse(res);
}

export async function createAssignmentAPI(data: any) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BACKEND_URL}/api/assignments`, {
    method: 'POST',
    headers: getAuthHeader(token),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}
