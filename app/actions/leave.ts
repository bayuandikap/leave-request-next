// app/actions/leave.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function createLeaveRequest(formData: FormData) {
  const employeeId = formData.get('employee_id');
  const reason = formData.get('reason');
  const startDate = formData.get('start_date');

  const response = await fetch('http://127.0.0.1:8000/api/leaves', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      employee_id: employeeId,
      reason: reason,
      start_date: startDate,
    }),
  });

  if (!response.ok) {
    return { success: false, message: 'Gagal mengajukan cuti' };
  }

  // Refresh cache halaman leave agar data baru langsung muncul di UI
  revalidatePath('/leaves');
  return { success: true, message: 'Pengajuan cuti berhasil terkirim' };
}