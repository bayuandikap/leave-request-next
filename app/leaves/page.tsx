// app/leaves/page.tsx
import { Suspense } from 'react';
import LeaveActionButtons from './LeaveActionButtons';
import Link from 'next/link';

interface LeaveRequest {
  id: number;
  reason: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  employee: {
    name: string;
    position: string;
  };
}

// 1. Fungsi fetch data leaves dari Laravel API
async function getLeaves(): Promise<LeaveRequest[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://leave-request-backend-production.up.railway.app';

  // Pastikan menyertakan prefix /api/leaves
  const res = await fetch(`${baseUrl}/api/leaves`, {
    cache: 'no-store',
  });

  if (!res.ok) return [];
  return res.json();
}

// 2. Komponen tabel khusus yang async (Server Component)
async function LeaveTable() {
  const leaves = await getLeaves();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Karyawan</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Periode</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Alasan</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {leaves.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                Belum ada riwayat permohonan cuti.
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{leave.employee?.name || 'Anonim'}</div>
                  <div className="text-xs text-gray-500">{leave.employee?.position || '-'}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {leave.start_date} s/d {leave.end_date}
                </td>
                <td className="px-6 py-4 text-gray-700 max-w-xs">{leave.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      leave.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : leave.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {leave.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {leave.status === 'pending' ? (
                    <LeaveActionButtons leaveId={leave.id} />
                  ) : (
                    <span className="text-xs text-gray-400 italic">Selesai</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// 3. Fallback placeholder saat memuat data
function LeaveTableSkeleton() {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 text-center text-gray-400 animate-pulse">
      Memuat permohonan cuti...
    </div>
  );
}

// 4. Halaman utama pembungkus
export default function LeavesPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approval Cuti Karyawan</h1>
          <p className="text-sm text-gray-500">Tinjau dan setujui permohonan cuti dari staf</p>
        </div>
        <Link
          href="/employees"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold px-4 py-2 rounded border border-gray-300 transition"
        >
          &larr; Master Karyawan
        </Link>
      </div>

      <Suspense fallback={<LeaveTableSkeleton />}>
        <LeaveTable />
      </Suspense>
    </div>
  );
}