// app/employees/page.tsx
import { Suspense } from 'react';
import AddEmployeeForm from './AddEmployeeForm';
import Link from 'next/link';
import EmployeeTableClient from './EmployeeTableClient';

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
  return <EmployeeTableClient employees={employees} />;
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