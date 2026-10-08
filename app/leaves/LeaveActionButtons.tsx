'use client';

import { updateLeaveStatus } from '@/app/actions/hris';
import { useTransition } from 'react';

export default function LeaveActionButtons({ leaveId }: { leaveId: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => startTransition(() => updateLeaveStatus(leaveId, 'approved'))}
        disabled={isPending}
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => startTransition(() => updateLeaveStatus(leaveId, 'rejected'))}
        disabled={isPending}
        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}