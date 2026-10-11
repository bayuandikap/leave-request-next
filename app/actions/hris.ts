// app/actions/hris.ts
'use server';

import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function addEmployee(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const position = formData.get('position');
  const role = formData.get('role');

  const res = await fetch(`${API_URL}/api/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ name, email, position, role }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    return { success: false, message: errorData.message || 'Gagal menambahkan karyawan' };
  }

  revalidatePath('/employees');
  return { success: true, message: 'Karyawan berhasil ditambahkan' };
}

// app/actions/hris.ts
export async function updateEmployee(id: number, formData: FormData) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://leave-request-backend-production.up.railway.app';
  const name = formData.get('name');
  const email = formData.get('email');
  const position = formData.get('position');
  const role = formData.get('role');

  const res = await fetch(`${baseUrl}/api/employees/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ name, email, position, role }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    return { success: false, message: errorData?.message || 'Gagal mengubah data karyawan' };
  }

  revalidatePath('/employees');
  return { success: true, message: 'Data karyawan berhasil diperbarui' };
}

export async function deleteEmployee(id: number) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://leave-request-backend-production.up.railway.app';
  const res = await fetch(`${baseUrl}/api/employees/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    return { success: false, message: 'Gagal menghapus karyawan' };
  }

  revalidatePath('/employees');
  return { success: true, message: 'Karyawan berhasil dihapus' };
}

export async function updateLeaveStatus(
  id: number,
  status: 'approved' | 'rejected',
  rejectionReason?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://leave-request-backend-production.up.railway.app';
  const targetUrl = `${baseUrl}/api/leaves/${id}/status`;

  const res = await fetch(targetUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      status,
      rejection_reason: rejectionReason || null,
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(`Gagal update status: ${JSON.stringify(errorData)}`);
  }

  revalidatePath('/leaves');
  return { success: true };
}