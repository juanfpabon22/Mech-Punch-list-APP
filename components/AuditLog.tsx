import React from 'react';
import { HistoryEvent, HistoryAction } from '../types';

interface AuditLogProps {
  history: HistoryEvent[];
}

const AuditLog: React.FC<AuditLogProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
        <div className="p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-transparent text-center text-sm text-slate-500">
            No hay historial registrado.
        </div>
    );
  }

  // Sort history newest first
  const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getActionIcon = (action: HistoryAction) => {
    switch (action) {
        case 'CREATE': return 'add_circle';
        case 'UPDATE': return 'edit';
        case 'STATUS_CHANGE': return 'swap_horiz'; // or published_with_changes
        case 'COMMENT': return 'chat';
        case 'ASSIGN': return 'person_add';
        case 'IMAGE_ADD': return 'add_a_photo';
        default: return 'info';
    }
  };

  const getActionColor = (action: HistoryAction) => {
    switch (action) {
        case 'CREATE': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
        case 'STATUS_CHANGE': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
        case 'COMMENT': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
        default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-transparent overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                Historial de Actividad
            </h3>
        </div>
        <div className="p-4">
            <div className="relative border-l-2 border-slate-100 dark:border-slate-700 space-y-6 ml-3">
                {sortedHistory.map((event) => (
                    <div key={event.id} className="relative pl-6">
                        {/* Dot / Icon */}
                        <div className={`absolute -left-[15px] top-0 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white dark:border-surface-dark ${getActionColor(event.action)}`}>
                            <span className="material-symbols-outlined text-[14px]">{getActionIcon(event.action)}</span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{event.userName}</span>
                                <span className="text-[10px] text-slate-400">{event.timestamp}</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 w-fit font-medium">
                                {event.userRole}
                            </span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                                {event.description}
                            </p>
                            
                            {/* Meta Changes (e.g. Status Change Visual) */}
                            {event.action === 'STATUS_CHANGE' && event.meta && (
                                <div className="mt-1 flex items-center gap-2 text-[10px] font-medium bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded border border-slate-100 dark:border-slate-700/50 w-fit">
                                    <span className="text-slate-500">{event.meta.prevStatus}</span>
                                    <span className="material-symbols-outlined text-[10px] text-slate-400">arrow_forward</span>
                                    <span className="text-primary">{event.meta.newStatus}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default AuditLog;
