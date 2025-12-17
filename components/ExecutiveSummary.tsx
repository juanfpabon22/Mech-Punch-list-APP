import React, { useState, useMemo } from 'react';
import { Project, Status, PunchItem } from '../types';
import { SYSTEMS } from '../constants';

interface ExecutiveSummaryProps {
  project: Project;
  items: PunchItem[];
  onBack: () => void;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ project, items, onBack }) => {
  const [selectedSystemId, setSelectedSystemId] = useState<string>('ALL');

  // Filter items based on selection
  const filteredItems = useMemo(() => {
    if (selectedSystemId === 'ALL') {
        return items;
    }
    return items.filter(item => item.systemId === selectedSystemId);
  }, [selectedSystemId, items]);

  // Calculate stats
  const totalItems = filteredItems.length;
  
  // Categorize Status
  const completedCount = filteredItems.filter(i => 
    [Status.CLOSED, Status.TECHNICAL_CLOSE, Status.VERIFIED].includes(i.status)
  ).length;

  const inProgressCount = filteredItems.filter(i => 
    i.status === Status.EXECUTED
  ).length;

  const pendingCount = filteredItems.filter(i => 
    [Status.OPEN, Status.REJECTED].includes(i.status)
  ).length;

  // Calculate percentages for the donut chart (circumference approx 251.2)
  const C = 251.2;
  const pctCompleted = totalItems > 0 ? (completedCount / totalItems) : 0;
  const pctInProgress = totalItems > 0 ? (inProgressCount / totalItems) : 0;
  const pctPending = totalItems > 0 ? (pendingCount / totalItems) : 0;

  const dashCompleted = C * pctCompleted;
  const dashInProgress = C * pctInProgress;
  const dashPending = C * pctPending;

  // Rotations for stacking segments
  const rotateInProgress = -90 + (pctCompleted * 360);
  const rotatePending = rotateInProgress + (pctInProgress * 360);

  const overallProgress = Math.round(pctCompleted * 100);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-y-auto">
      <header className="flex items-center justify-between px-4 py-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
             <h1 className="text-sm font-bold leading-tight">{project.name}</h1>
             <span className="text-[10px] text-slate-500 uppercase tracking-wider">Estatus General</span>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="p-4 flex flex-col gap-6 pb-24">
        
        {/* Filter Dropdown */}
        <div className="relative z-20">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1 block">Filtrar por Área</label>
            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">filter_alt</span>
                <select 
                    value={selectedSystemId}
                    onChange={(e) => setSelectedSystemId(e.target.value)}
                    className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-transparent rounded-xl pl-11 pr-10 py-3 appearance-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer shadow-sm text-sm font-semibold"
                >
                    <option value="ALL">General (Todo el Proyecto)</option>
                    {SYSTEMS.map(sys => (
                        <option key={sys.id} value={sys.id}>{sys.name}</option>
                    ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">expand_more</span>
            </div>
        </div>

        {/* Status Chart */}
        <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">Estado de Pendientes</h2>
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm flex flex-col items-center justify-center relative border border-slate-200 dark:border-transparent">
                <div className="relative size-64 flex items-center justify-center">
                    {totalItems === 0 ? (
                        <div className="text-slate-400 text-sm font-medium">No hay datos</div>
                    ) : (
                        <svg className="w-full h-full transform" viewBox="0 0 100 100">
                            {/* Background Circle */}
                            <circle className="stroke-slate-100 dark:stroke-slate-800" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
                            
                            {/* Completed (Green) */}
                            {completedCount > 0 && (
                                <circle 
                                    className="stroke-green-500 transition-all duration-1000 ease-out" 
                                    cx="50" cy="50" 
                                    fill="transparent" r="40" 
                                    strokeDasharray={`${dashCompleted} ${C - dashCompleted}`} 
                                    strokeDashoffset="0" 
                                    strokeWidth="8"
                                    transform="rotate(-90 50 50)"
                                ></circle>
                            )}

                            {/* In Progress (Blue) */}
                            {inProgressCount > 0 && (
                                <circle 
                                    className="stroke-blue-500 transition-all duration-1000 ease-out" 
                                    cx="50" cy="50" 
                                    fill="transparent" r="40" 
                                    strokeDasharray={`${dashInProgress} ${C - dashInProgress}`} 
                                    strokeDashoffset="0" 
                                    strokeWidth="8"
                                    transform={`rotate(${rotateInProgress} 50 50)`}
                                ></circle>
                            )}

                            {/* Pending (Orange/Red) */}
                            {pendingCount > 0 && (
                                <circle 
                                    className="stroke-orange-500 transition-all duration-1000 ease-out" 
                                    cx="50" cy="50" 
                                    fill="transparent" r="40" 
                                    strokeDasharray={`${dashPending} ${C - dashPending}`} 
                                    strokeDashoffset="0" 
                                    strokeWidth="8"
                                    transform={`rotate(${rotatePending} 50 50)`}
                                ></circle>
                            )}
                        </svg>
                    )}

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold animate-fade-in">{totalItems}</span>
                        <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-1">Total</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-6 w-full">
                    <div className="flex items-center gap-3">
                        <div className="size-3 rounded-full bg-green-500 shadow shadow-green-500/50"></div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold">Completado</span>
                            <span className="text-[10px] text-slate-500">{completedCount} items ({Math.round(pctCompleted*100)}%)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-3 rounded-full bg-blue-500 shadow shadow-blue-500/50"></div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold">En Proceso</span>
                            <span className="text-[10px] text-slate-500">{inProgressCount} items ({Math.round(pctInProgress*100)}%)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-3 rounded-full bg-orange-500 shadow shadow-orange-500/50"></div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold">Pendiente</span>
                            <span className="text-[10px] text-slate-500">{pendingCount} items ({Math.round(pctPending*100)}%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Progress */}
        <section className="flex flex-col gap-3">
            <h3 className="text-base font-bold">Avance Físico</h3>
            <div className="bg-white dark:bg-surface-dark p-5 rounded-xl shadow-sm border border-slate-200 dark:border-transparent flex flex-col gap-4">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <span className="text-3xl font-bold">{overallProgress}%</span>
                        <span className="text-xs text-slate-500">
                            {selectedSystemId === 'ALL' ? 'Proyecto General' : SYSTEMS.find(s => s.id === selectedSystemId)?.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs font-bold"><span className="material-symbols-outlined text-sm">trending_up</span> +5% vs semana</div>
                </div>
                <div className="relative h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{width: `${overallProgress}%`}}></div>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default ExecutiveSummary;