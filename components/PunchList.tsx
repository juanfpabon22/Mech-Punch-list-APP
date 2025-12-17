import React, { useState, useMemo } from 'react';
import { Project, PunchItem, Priority, Status, User, Role } from '../types';

interface PunchListProps {
  items: PunchItem[];
  project: Project;
  currentUser: User;
  systemName?: string;
  onBack: () => void;
  onSelectItem: (item: PunchItem) => void;
  onAddItem: () => void;
}

type FilterType = 'ALL' | 'OPEN' | 'VERIFICATION' | 'CLOSED';

const PunchList: React.FC<PunchListProps> = ({ items, project, currentUser, systemName, onBack, onSelectItem, onAddItem }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  
  const getStatusColorClass = (status: Status) => {
    switch (status) {
        case Status.CLOSED: return 'bg-primary text-background-dark';
        case Status.TECHNICAL_CLOSE: return 'bg-primary/80 text-white';
        case Status.VERIFIED: return 'bg-secondary text-black';
        case Status.EXECUTED: return 'bg-blue-500 text-white';
        case Status.OPEN: return 'bg-danger text-white'; // Red for open issues
        case Status.REJECTED: return 'bg-red-700 text-white';
        default: return 'bg-slate-700 text-slate-300';
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'OPEN') return item.status === Status.OPEN || item.status === Status.REJECTED;
        if (activeFilter === 'VERIFICATION') return item.status === Status.EXECUTED || item.status === Status.VERIFIED;
        if (activeFilter === 'CLOSED') return item.status === Status.TECHNICAL_CLOSE || item.status === Status.CLOSED;
        return true;
    });
  }, [items, activeFilter]);

  return (
    <div className="flex flex-col h-full bg-background-dark text-white">
      {/* Header - Search Style */}
      <div className="px-4 py-3 bg-background-dark sticky top-0 z-20 shadow-md shadow-black/20">
        <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="p-2 -ml-2 text-text-secondary hover:text-white rounded-full hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex-1 relative">
                 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
                 <input 
                    type="text" 
                    placeholder="Search items..." 
                    className="w-full bg-surface-dark border-none rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-primary placeholder:text-text-secondary"
                 />
            </div>
            <div className="relative">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <div className="absolute top-0 right-0 h-2 w-2 bg-danger rounded-full"></div>
            </div>
        </div>

        <div className="flex items-center justify-between mb-3">
             <div className="flex flex-col">
                 <h1 className="text-xl font-bold flex items-center gap-2">
                    Punch List
                 </h1>
                 {systemName && (
                    <span className="text-sm font-medium text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">grid_view</span>
                        {systemName}
                    </span>
                 )}
             </div>
             <button className="p-2 rounded-lg bg-surface-dark border border-border-dark text-text-secondary hover:text-white">
                <span className="material-symbols-outlined text-lg">tune</span>
             </button>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             {['ALL', 'OPEN', 'VERIFICATION', 'CLOSED'].map((filter) => (
                 <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as FilterType)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                        activeFilter === filter 
                        ? 'bg-white text-black border-white' 
                        : 'bg-surface-dark text-text-secondary border-border-dark hover:border-slate-500'
                    }`}
                 >
                    {filter === 'ALL' ? 'All Items' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                 </button>
             ))}
        </div>
      </div>

      {/* Column Headers */}
      <div className="flex justify-between px-4 py-2 text-xs font-medium text-text-secondary bg-background-dark border-b border-border-dark mt-1">
         <span>Items ({filteredItems.length})</span>
         <div className="flex gap-8">
            <span>Priority</span>
            <span className="w-16 text-right">Status</span>
         </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
         {filteredItems.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-10 opacity-50 space-y-3">
                 <span className="material-symbols-outlined text-4xl">assignment_turned_in</span>
                 <p className="text-sm font-medium">No items found for this filter</p>
             </div>
         ) : (
             filteredItems.map((item) => (
                <div 
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="flex items-center justify-between py-4 border-b border-border-dark cursor-pointer hover:bg-surface-dark/30 -mx-2 px-2 transition-colors group"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative shrink-0">
                            {item.images.length > 0 ? (
                                <div className="h-12 w-12 rounded-lg bg-cover bg-center bg-surface-dark border border-border-dark" style={{ backgroundImage: `url('${item.images[0].url}')` }}></div>
                            ) : (
                                <div className="h-12 w-12 rounded-lg bg-surface-dark flex items-center justify-center text-text-secondary border border-border-dark">
                                    <span className="material-symbols-outlined text-lg">image</span>
                                </div>
                            )}
                            {/* Type Indicator small icon */}
                            <div className="absolute -bottom-1 -right-1 bg-background-dark rounded-full p-0.5 ring-2 ring-background-dark">
                                {item.priority === Priority.A ? (
                                    <span className="material-symbols-outlined text-danger text-[14px] filled">error</span>
                                ) : item.priority === Priority.B ? (
                                    <span className="material-symbols-outlined text-secondary text-[14px] filled">warning</span>
                                ) : (
                                    <span className="material-symbols-outlined text-text-secondary text-[14px] filled">info</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-col min-w-0 gap-0.5">
                            <span className="font-bold text-sm truncate text-white group-hover:text-primary transition-colors">{item.title}</span>
                            <div className="flex items-center gap-1.5 text-text-secondary text-[11px] truncate">
                                <span className="flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[10px]">person</span>
                                    {item.assignedTo.split(' ')[0]}
                                </span>
                                {/* Date Display Removed */}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pl-2">
                        <div className={`w-20 py-1.5 rounded-md text-[10px] font-bold text-center border ${getStatusColorClass(item.status).replace('bg-', 'border-').replace('text-white', 'text-current').replace('text-black', 'text-current') + ' ' + getStatusColorClass(item.status)}`}>
                            {item.status}
                        </div>
                        <span className="material-symbols-outlined text-text-secondary text-sm">chevron_right</span>
                    </div>
                </div>
             ))
         )}
      </div>

      {/* FAB - Visible for Creator and Auditor */}
      {(currentUser.role === Role.CREATOR || currentUser.role === Role.AUDITOR) && (
        <div className="fixed bottom-24 right-4 z-40">
            <button 
                onClick={onAddItem} 
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-background-dark shadow-lg shadow-primary/40 transition-transform active:scale-95 hover:bg-primary-dark"
            >
                <span className="material-symbols-outlined text-3xl">add</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default PunchList;