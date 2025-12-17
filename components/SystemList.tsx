import React from 'react';
import { Project, User, Role } from '../types';
import { SYSTEMS } from '../constants';

interface SystemListProps {
  project: Project;
  currentUser: User;
  onBack: () => void;
  onSelectSystem: (id: string) => void;
}

const SystemList: React.FC<SystemListProps> = ({ project, currentUser, onBack, onSelectSystem }) => {
  // Use centralized systems filtered by project (mock logic, currently all systems are for p1 in constants)
  // In a real app we'd filter: SYSTEMS.filter(s => s.projectId === project.id)
  const systems = SYSTEMS.map(s => ({
    ...s,
    items: Math.floor(Math.random() * 20) + 5, // Mock dynamic stats for list view
    completed: Math.floor(Math.random() * 5),
    change: '+1.5%'
  }));

  return (
    <div className="flex flex-col h-full bg-background-dark text-white">
      <header className="flex items-center justify-between px-4 py-3 bg-background-dark sticky top-0 z-10 border-b border-border-dark">
        {/* Empty placeholder div for layout balance since Back button is removed */}
        <div className="w-10"></div>
        
        <div className="flex flex-col items-center">
            <h1 className="text-base font-bold leading-tight">{project.name}</h1>
            <span className="text-xs text-text-secondary">Areas & Systems</span>
        </div>
        
        {currentUser.role === Role.AUDITOR ? (
           <button className="flex size-10 items-center justify-center rounded-full bg-surface-dark text-primary hover:bg-surface-dark/80 transition-colors">
             <span className="material-symbols-outlined">add</span>
           </button>
        ) : (
           <div className="w-10"></div>
        )}
      </header>

      <div className="flex justify-between px-4 py-2 text-xs font-medium text-text-secondary bg-background-dark">
         <span>Area Name</span>
         <div className="flex gap-6">
            <span>Items</span>
            <span>Complete</span>
         </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-24">
        <div className="flex flex-col gap-0">
            {systems.map((sys) => (
                <div 
                    key={sys.id} 
                    onClick={() => onSelectSystem(sys.id)} 
                    className="flex items-center justify-between py-4 border-b border-border-dark cursor-pointer active:bg-surface-dark/30 -mx-2 px-2 transition-colors"
                >
                    <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-lg bg-surface-dark flex items-center justify-center text-white border border-border-dark">
                             <span className="font-bold text-xs">{sys.code.split('-')[1] || 'GN'}</span>
                         </div>
                         <div className="flex flex-col">
                             <span className="font-bold text-sm text-white">{sys.name}</span>
                             <span className="text-xs text-text-secondary">{sys.code}</span>
                         </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-white">{sys.items}</span>
                        <div className={`px-3 py-1 rounded-md text-xs font-bold ${sys.completed === sys.items ? 'bg-primary text-background-dark' : 'bg-surface-dark text-primary'}`}>
                            {Math.round((sys.completed/sys.items)*100)}%
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SystemList;