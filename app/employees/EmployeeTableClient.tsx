// app/employees/EmployeeTableClient.tsx
'use client';

import { useState, useTransition } from 'react';
import { deleteEmployee, updateEmployee } from '@/app/actions/hris';

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  role: string;
}

export default function EmployeeTableClient({ employees }: { employees: Employee[] }) {
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEmployee) return;

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateEmployee(editingEmployee.id, formData);
      if (res.success) {
        setEditingEmployee(null);
        setFeedback(null);
      } else {
        setFeedback(res.message);
      }
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteEmployee(id);
      setDeletingId(null);
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Posisi</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Belum ada data karyawan.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-gray-500">#{emp.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{emp.name}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.position}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      emp.role === 'hr' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => setEditingEmployee(emp)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingId(emp.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edit Employee */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-4">Edit Data Karyawan</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama</label>
                <input
                  name="name"
                  defaultValue={editingEmployee.name}
                  required
                  className="w-full border rounded px-3 py-2 text-sm border-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={editingEmployee.email}
                  required
                  className="w-full border rounded px-3 py-2 text-sm border-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Posisi</label>
                <input
                  name="position"
                  defaultValue={editingEmployee.position}
                  required
                  className="w-full border rounded px-3 py-2 text-sm border-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  defaultValue={editingEmployee.role}
                  className="w-full border rounded px-3 py-2 text-sm border-gray-300 bg-white"
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                </select>
              </div>

              {feedback && <p className="text-xs text-rose-600">{feedback}</p>}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-2">Hapus Karyawan</h3>
            <p className="text-sm text-gray-600 mb-5">
              Apakah Anda yakin ingin menghapus data ini? Seluruh riwayat cuti karyawan ini juga akan terhapus.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={isPending}
                className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-md font-medium disabled:opacity-50"
              >
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}