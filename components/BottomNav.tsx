import React from 'react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    // Removed PROJECTS
    { id: 'SYSTEMS', icon: 'visibility', label: 'Áreas' }, 
    { id: 'DASHBOARD', icon: 'pie_chart', label: 'Estatus' }, 
    { id: 'NOTIFICATIONS', icon: 'search', label: 'Pendientes' }, 
    { id: 'PROFILE', icon: 'account_balance_wallet', label: 'Usuario' }, 
  ];

  return (
    <nav className="fixed bottom-0 z-50 w-full bg-surface-dark border-t border-border-dark pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
            const isActive = 
                (item.id === 'SYSTEMS' && (currentView === 'SYSTEMS' || currentView === 'PUNCHLIST' || currentView === 'ITEM_DETAIL')) ||
                (item.id === 'DASHBOARD' && currentView === 'DASHBOARD') ||
                (item.id === 'NOTIFICATIONS' && currentView === 'NOTIFICATIONS') ||
                (item.id === 'PROFILE' && currentView === 'PROFILE');

            return (
                <button 
                    key={item.id} 
                    onClick={() => onNavigate(item.id as ViewState)}
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-white' : 'text-text-secondary hover:text-slate-400'}`}
                >
                    <span className={`material-symbols-outlined text-[24px] ${isActive ? 'filled' : ''}`}>{item.icon}</span>
                    <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            )
        })}
      </div>
    </nav>
  );
};

export default BottomNav;