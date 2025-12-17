import React from 'react';
import { PunchItem, User, Role, Status } from '../types';
import AuditLog from './AuditLog';

interface PunchItemDetailProps {
  item: PunchItem;
  currentUser: User;
  onBack: () => void;
  onEdit: () => void;
}

const PunchItemDetail: React.FC<PunchItemDetailProps> = ({ item, currentUser, onBack, onEdit }) => {
  
  // Helper to determine status color
  const getStatusColorClass = (status: Status) => {
    switch (status) {
      case Status.CLOSED: return 'text-primary border-primary bg-primary/10';
      case Status.TECHNICAL_CLOSE: return 'text-primary border-primary bg-primary/10';
      case Status.VERIFIED: return 'text-secondary border-secondary bg-secondary/10';
      case Status.EXECUTED: return 'text-blue-400 border-blue-400 bg-blue-400/10';
      case Status.OPEN: return 'text-danger border-danger bg-danger/10';
      default: return 'text-slate-400 border-slate-600 bg-slate-600/10';
    }
  };

  const steps = [
    { label: 'Execution', requiredRole: Role.EXECUTOR, activeStatus: [Status.OPEN], doneStatus: [Status.EXECUTED, Status.VERIFIED, Status.TECHNICAL_CLOSE, Status.CLOSED], icon: 'handyman' },
    { label: 'Verification', requiredRole: Role.VERIFIER, activeStatus: [Status.EXECUTED], doneStatus: [Status.VERIFIED, Status.TECHNICAL_CLOSE, Status.CLOSED], icon: 'fact_check' },
    { label: 'Direction', requiredRole: Role.DIRECTOR, activeStatus: [Status.VERIFIED], doneStatus: [Status.TECHNICAL_CLOSE, Status.CLOSED], icon: 'supervisor_account' },
    { label: 'Audit', requiredRole: Role.AUDITOR, activeStatus: [Status.TECHNICAL_CLOSE], doneStatus: [Status.CLOSED], icon: 'verified' },
  ];

  const canAct = () => {
    if (item.status === Status.OPEN && currentUser.role === Role.EXECUTOR) return 'EXECUTE';
    if (item.status === Status.EXECUTED && currentUser.role === Role.VERIFIER) return 'VERIFY';
    if (item.status === Status.VERIFIED && currentUser.role === Role.DIRECTOR) return 'DIRECT';
    if (item.status === Status.TECHNICAL_CLOSE && currentUser.role === Role.AUDITOR) return 'AUDIT';
    return null;
  };

  const actionType = canAct();

  return (
    <div className="flex flex-col h-full bg-background-dark text-white pb-24 overflow-y-auto">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 px-4 py-4 backdrop-blur-md border-b border-border-dark">
        <button onClick={onBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-dark cursor-pointer text-text-secondary hover:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold flex-1 text-center pr-10">{item.title}</h1>
        {(currentUser.role === Role.CREATOR || currentUser.role === Role.DIRECTOR) && (
            <button onClick={onEdit} className="text-primary font-semibold text-sm">Edit</button>
        )}
      </header>

      <main className="flex flex-col gap-6 p-4">
        {/* Status Card */}
        <div className={`flex items-center gap-3 rounded-xl border p-4 ${getStatusColorClass(item.status)}`}>
          <div className="flex items-center justify-center rounded-full bg-white/10 p-2">
            <span className="material-symbols-outlined">
                {item.status === Status.CLOSED ? 'check_circle' : 
                 item.status === Status.OPEN ? 'error' : 'pending'}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold uppercase tracking-wide">{item.status}</p>
            <p className="text-xs opacity-80">
                Action required by {item.assignedTo}
            </p>
          </div>
        </div>

        {/* Evidence Images */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-sm font-semibold text-text-secondary">Evidence</h3>
            <span className="text-xs text-primary font-medium cursor-pointer">View All</span>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {(item.images || []).map((img, idx) => (
                <div key={idx} className="relative min-w-[200px] h-32 flex-shrink-0 rounded-lg overflow-hidden border border-border-dark">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${img.url}')` }}></div>
                </div>
            ))}
            {(!item.images || item.images.length === 0) && (
                 <div className="p-4 text-xs text-slate-500 italic border border-dashed border-border-dark rounded-lg w-full text-center">
                    No evidence attached
                 </div>
            )}
          </div>
        </div>

        {/* Info Grid - Date Removed */}
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 rounded-xl bg-surface-dark p-4 border border-border-dark">
                <span className="text-[10px] text-text-secondary font-bold uppercase">Location</span>
                <p className="text-sm font-semibold">{item.location}</p>
            </div>
        </div>

        {/* Description */}
        <div className="rounded-xl bg-surface-dark p-4 border border-border-dark">
            <h3 className="text-[10px] text-text-secondary font-bold uppercase mb-2">Description</h3>
            <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
        </div>

        {/* Workflow */}
        <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-text-secondary uppercase">Progress</h3>
            <div className="flex justify-between items-center relative">
                 <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border-dark -z-10"></div>
                 {steps.map((step, idx) => {
                     const isActive = step.activeStatus.includes(item.status);
                     const isDone = step.doneStatus.includes(item.status);
                     return (
                         <div key={idx} className="flex flex-col items-center bg-background-dark px-2">
                             <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${isDone ? 'bg-primary border-primary text-background-dark' : isActive ? 'bg-background-dark border-primary text-primary' : 'bg-surface-dark border-border-dark text-text-secondary'}`}>
                                 <span className="material-symbols-outlined text-[16px]">{isDone ? 'check' : step.icon}</span>
                             </div>
                             <span className={`text-[10px] mt-1 font-medium ${isActive || isDone ? 'text-white' : 'text-text-secondary'}`}>{step.label}</span>
                         </div>
                     )
                 })}
            </div>
        </div>

        {/* Log */}
        <AuditLog history={item.history} />

      </main>

      {/* Action Bar */}
      {actionType && (
        <div className="fixed bottom-0 left-0 z-40 w-full border-t border-border-dark bg-background-dark p-4 pb-8 safe-area-bottom">
            <div className="flex gap-3">
                <button className="flex-1 rounded-lg border border-danger/50 text-danger font-bold py-3 text-sm">
                    Reject
                </button>
                <button className="flex-[2] rounded-lg bg-primary text-background-dark font-bold py-3 text-sm hover:bg-primary-dark">
                    {actionType === 'EXECUTE' ? 'Report Done' : actionType === 'VERIFY' ? 'Approve' : actionType === 'DIRECT' ? 'Technical Close' : 'Final Close'}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default PunchItemDetail;