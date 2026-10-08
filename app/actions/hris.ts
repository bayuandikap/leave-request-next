// app/actions/hris.ts
'use server';

import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Action 1: Menambah Karyawan Baru
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

// Action 2: Update Status Cuti (Approve / Reject)
export async function updateLeaveStatus(id: number, status: 'approved' | 'rejected') {
  const res = await fetch(`${API_URL}/leaves/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    return { success: false, message: 'Gagal memperbarui status cuti' };
  }

  revalidatePath('/leaves');
  return { success: true, message: `Pengajuan cuti berhasil di-${status}` };
}