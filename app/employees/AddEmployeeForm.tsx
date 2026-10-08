'use client';

import { addEmployee } from '@/app/actions/hris';
import { useRef, useState } from 'react';

export default function AddEmployeeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setFeedback(null);
    const res = await addEmployee(formData);
    setIsPending(false);

    if (res.success) {
      formRef.current?.reset();
    }
    setFeedback(res.message);
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Tambah Karyawan Baru</h2>
      <form ref={formRef} action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input name="name" required placeholder="Budi Santoso" className="w-full border rounded px-3 py-2 text-sm text-gray-900 border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" required placeholder="budi@example.com" className="w-full border rounded px-3 py-2 text-sm text-gray-900 border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan / Posisi</label>
          <input name="position" required placeholder="Backend Engineer" className="w-full border rounded px-3 py-2 text-sm text-gray-900 border-gray-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select name="role" defaultValue="employee" className="w-full border rounded px-3 py-2 text-sm text-gray-900 border-gray-300 bg-white">
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
          </select>
        </div>
        <div className="md:col-span-2 flex items-center justify-between mt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded text-sm disabled:opacity-50 transition"
          >
            {isPending ? 'Menyimpan...' : 'Simpan Karyawan'}
          </button>
          {feedback && <span className="text-sm font-medium text-gray-600">{feedback}</span>}
        </div>
      </form>
    </div>
  );
}