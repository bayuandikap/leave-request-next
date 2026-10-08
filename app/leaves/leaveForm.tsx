// app/leaves/LeaveForm.tsx
'use client';

import { createLeaveRequest } from '@/app/actions/leave';
import { useState } from 'react';

export default function LeaveForm({ employeeId }: { employeeId: number }) {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const result = await createLeaveRequest(formData);
    setStatus(result.message);
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-md border p-6 rounded-lg">
      <input type="hidden" name="employee_id" value={employeeId} />
      
      <div>
        <label className="block text-sm font-medium">Alasan Cuti</label>
        <textarea name="reason" required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Tanggal Mulai</label>
        <input type="date" name="start_date" required className="w-full border p-2 rounded" />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Kirim Pengajuan
      </button>

      {status && <p className="text-sm mt-2 text-green-600">{status}</p>}
    </form>
  );
}