// app/leaves/LeaveManagementClient.tsx
'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { updateLeaveStatus } from '@/app/actions/hris';

export interface LeaveRequest {
  id: number;
  reason: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  employee: {
    name: string;
    position: string;
  };
}

export default function LeaveManagementClient({ initialLeaves }: { initialLeaves: LeaveRequest[] }) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [, startTransition] = useTransition();

  const [optimisticLeaves, setOptimisticStatus] = useOptimistic(
    initialLeaves,
    (state, update: { id: number; status: 'approved' | 'rejected'; rejection_reason?: string }) =>
      state.map((item) =>
        item.id === update.id
          ? { ...item, status: update.status, rejection_reason: update.rejection_reason }
          : item
      )
  );

  const handleApprove = (id: number) => {
    startTransition(async () => {
      setOptimisticStatus({ id, status: 'approved' });
      await updateLeaveStatus(id, 'approved');
    });
  };

  const handleConfirmReject = () => {
    if (!rejectingId) return;

    if (!rejectionReasonInput.trim()) {
      setReasonError('Alasan penolakan wajib diisi agar karyawan memahami penyebabnya.');
      return;
    }

    const id = rejectingId;
    const reasonText = rejectionReasonInput.trim();

    // Reset state modal
    setRejectingId(null);
    setRejectionReasonInput('');
    setReasonError('');

    startTransition(async () => {
      setOptimisticStatus({ id, status: 'rejected', rejection_reason: reasonText });
      await updateLeaveStatus(id, 'rejected', reasonText);
    });
  };

  const totalPending = optimisticLeaves.filter((l) => l.status === 'pending').length;
  const totalApproved = optimisticLeaves.filter((l) => l.status === 'approved').length;
  const totalRejected = optimisticLeaves.filter((l) => l.status === 'rejected').length;

  const filteredLeaves = optimisticLeaves.filter((item) => (filter === 'all' ? true : item.status === filter));

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-amber-200 bg-amber-50/40">
          <p className="text-xs font-semibold text-amber-700 uppercase">Menunggu Tindakan</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{totalPending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-emerald-200 bg-emerald-50/40">
          <p className="text-xs font-semibold text-emerald-700 uppercase">Telah Disetujui</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{totalApproved}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-rose-200 bg-rose-50/40">
          <p className="text-xs font-semibold text-rose-700 uppercase">Telah Ditolak</p>
          <p className="text-2xl font-bold text-rose-900 mt-1">{totalRejected}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 pb-3 text-sm">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              filter === tab ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab === 'all' ? 'Semua' : tab === 'pending' ? 'Menunggu' : tab === 'approved' ? 'Disetujui' : 'Ditolak'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Karyawan</th>
              <th className="px-6 py-3 text-left">Periode Cuti</th>
              <th className="px-6 py-3 text-left">Alasan Pengajuan</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Tidak ada data cuti untuk filter ini.
                </td>
              </tr>
            ) : (
              filteredLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{leave.employee?.name || 'Karyawan'}</p>
                    <p className="text-xs text-gray-500">{leave.employee?.position || '-'}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {leave.start_date} s/d {leave.end_date}
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-w-xs">
                    <p>{leave.reason}</p>
                    {leave.status === 'rejected' && leave.rejection_reason && (
                      <p className="text-xs text-rose-600 mt-1 italic font-medium">
                        Alasan penolakan: "{leave.rejection_reason}"
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        leave.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : leave.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {leave.status === 'approved'
                        ? 'Disetujui'
                        : leave.status === 'rejected'
                        ? 'Ditolak'
                        : 'Menunggu Persetujuan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {leave.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(leave.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(leave.id);
                            setRejectionReasonInput('');
                            setReasonError('');
                          }}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition"
                        >
                          Tolak
                        </button>
                      </div>
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

      {/* Modal Dialog Input Alasan Reject */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">Tolak Permohonan Cuti</h3>
            <p className="text-sm text-gray-600 mb-4">
              Silakan tuliskan alasan penolakan secara jelas agar karyawan dapat mengetahuinya.
            </p>

            <textarea
              value={rejectionReasonInput}
              onChange={(e) => {
                setRejectionReasonInput(e.target.value);
                if (reasonError) setReasonError('');
              }}
              rows={3}
              placeholder="Misal: Jadwal bertabrakan dengan agenda rilis, atau kuota tim tidak mencukupi..."
              className="w-full border border-gray-300 rounded-md p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            {reasonError && <p className="text-xs text-rose-600 mt-1">{reasonError}</p>}

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-md font-medium transition"
              >
                Konfirmasi Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}