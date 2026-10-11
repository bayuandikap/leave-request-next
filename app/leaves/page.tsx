// app/leaves/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import LeaveManagementClient, { LeaveRequest } from './LeaveManagementClient';

async function getLeaves(): Promise<LeaveRequest[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://leave-request-backend-production.up.railway.app';
  const res = await fetch(`${baseUrl}/api/leaves`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

async function LeaveTableWrapper() {
  const leaves = await getLeaves();
  return <LeaveManagementClient initialLeaves={leaves} />;
}

export default function LeavesPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Persetujuan Cuti Karyawan</h1>
          <p className="text-sm text-gray-500">Kelola dan tinjau seluruh permohonan cuti aktif</p>
        </div>
        <Link
          href="/employees"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded border border-gray-300 transition"
        >
          &larr; Master Karyawan
        </Link>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-gray-400 bg-white rounded border animate-pulse">Memuat permohonan...</div>}>
        <LeaveTableWrapper />
      </Suspense>
    </div>
  );
}