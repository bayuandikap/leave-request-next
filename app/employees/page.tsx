// app/employees/page.tsx
import { Suspense } from 'react';
import AddEmployeeForm from './AddEmployeeForm';
import Link from 'next/link';

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  role: string;
  created_at: string;
}

// 1. Fungsi fetch data
async function getEmployees(): Promise<Employee[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/api/employees`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

// 2. Komponen khusus untuk render tabel (Server Component terpisah)
async function EmployeeTable() {
  const employees = await getEmployees();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Posisi</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {employees.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                Belum ada data karyawan. Silakan tambah data pertama di form atas.
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
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      emp.role === 'hr'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {emp.role}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// 3. Fallback placeholder / skeleton saat data sedang diambil
function TableSkeleton() {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 text-center text-gray-400 animate-pulse">
      Memuat data karyawan...
    </div>
  );
}

// 4. Halaman utama (langsung tampil cepat tanpa terhalang fetch)
export default function EmployeesPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Karyawan</h1>
          <p className="text-sm text-gray-500">Kelola daftar seluruh personel perusahaan</p>
        </div>
        <Link
          href="/leaves"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded border border-gray-300 transition"
        >
          Lihat Pengajuan Cuti &rarr;
        </Link>
      </div>

      <AddEmployeeForm />

      {/* Bungkus komponen async data fetching dengan Suspense */}
      <Suspense fallback={<TableSkeleton />}>
        <EmployeeTable />
      </Suspense>
    </div>
  );
}