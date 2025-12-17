import React from 'react';
import { Project, User, Role } from '../types';

interface ProjectListProps {
  projects: Project[];
  currentUser: User;
  onSelectProject: (project: Project) => void;
  onOpenAI: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, currentUser, onSelectProject, onOpenAI }) => {
  // Calculate aggregate stats for the "Portfolio" header look
  const totalItems = projects.reduce((acc, p) => acc + p.itemsTotal, 0);
  const completedItems = projects.reduce((acc, p) => acc + p.itemsCompleted, 0);
  const overallProgress = Math.round((completedItems / totalItems) * 100) || 0;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-dark text-white">
      {/* Header Section like "My Portfolio" */}
      <div className="px-4 pt-6 pb-2 bg-background-dark">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-full bg-slate-800 bg-cover bg-center border border-border-dark" style={{ backgroundImage: `url("${currentUser.avatar}")` }}></div>
             <span className="font-bold text-lg">My Projects</span>
             <span className="material-symbols-outlined text-text-secondary text-sm">expand_more</span>
          </div>
          <div className="flex gap-4 text-text-secondary">
             <span className="material-symbols-outlined cursor-pointer hover:text-white">equalizer</span>
             <span onClick={onOpenAI} className="material-symbols-outlined cursor-pointer hover:text-white">auto_awesome</span>
             {currentUser.role === Role.AUDITOR && (
                <span className="material-symbols-outlined cursor-pointer hover:text-white text-primary">add_circle</span>
             )}
             <span className="material-symbols-outlined cursor-pointer hover:text-white">notifications</span>
          </div>
        </div>

        <div className="mb-6">
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
                <span>Total Items</span>
                <span className="material-symbols-outlined text-xs">visibility</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{totalItems}</span>
                <span className="text-sm font-medium text-danger">{(totalItems - completedItems)} Pending</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
                 <span className="text-sm text-primary font-medium">+{completedItems} Completed</span>
                 <span className="text-xs text-text-secondary">Today</span>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
            <button className="flex-1 bg-surface-dark border border-border-dark rounded-full py-2 text-sm font-semibold hover:bg-slate-800 transition-colors">
                History
            </button>
            <button className="flex-1 bg-surface-dark border border-border-dark rounded-full py-2 text-sm font-semibold hover:bg-slate-800 transition-colors">
                Analysis
            </button>
            <button className="flex-1 bg-surface-dark border border-border-dark rounded-full py-2 text-sm font-semibold hover:bg-slate-800 transition-colors">
                Report
            </button>
        </div>
      </div>

      {/* List Section */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
        <div className="flex justify-between items-center mb-4 text-sm font-medium text-text-secondary">
            <span>Project ({projects.length})</span>
            <div className="flex gap-4">
                <span>Progress</span>
                <span>Status</span>
            </div>
        </div>

        <div className="flex flex-col gap-1">
            {projects.map((project) => (
                <div 
                    key={project.id} 
                    onClick={() => onSelectProject(project)}
                    className="flex items-center justify-between py-4 border-b border-border-dark cursor-pointer active:bg-surface-dark/50 transition-colors -mx-2 px-2 rounded-lg"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-800 bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${project.image}")` }}></div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base">{project.name}</span>
                            <span className="text-xs text-text-secondary">{project.location.split('•')[0]}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                        <span className={`font-medium ${project.progress >= 80 ? 'text-primary' : project.progress >= 50 ? 'text-white' : 'text-danger'}`}>
                            {project.progress}%
                        </span>
                        <span className="text-xs text-text-secondary text-right">
                           {project.itemsCompleted}/{project.itemsTotal} OK
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;