import React, { useState } from 'react';
import { User, Role } from '../types';

interface NotificationsProps {
  onVisitItem: (itemId: string) => void;
  onAddItem: () => void;
  currentUser: User;
}

interface NotificationItem {
  id: string;
  type: 'APPROVAL' | 'MENTION' | 'SYSTEM' | 'ASSIGN';
  user?: string;
  itemId?: string; // ID linking to punch item
  title: string;
  description: string;
  time: string;
  read: boolean;
  canApprove?: boolean;
}

const Notifications: React.FC<NotificationsProps> = ({ onVisitItem, onAddItem, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'MENTION' | 'UNREAD'>('ALL');
  
  // Mock State Data
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
        id: 'n1',
        type: 'APPROVAL',
        user: 'Juan Pérez', // Exec1
        itemId: 'pi2', // Links to actual mock data
        title: 'Solicitud de aprobación',
        description: 'Reportó ejecución del ítem "Falta luminaria". Requiere tu verificación.',
        time: '2m',
        read: false,
        canApprove: true
    },
    {
        id: 'n2',
        type: 'MENTION',
        user: 'Luis Narvaez',
        itemId: 'pi1',
        title: 'Te mencionó en un comentario',
        description: '@Supervisor1 por favor revisar si esto requiere cambio de material.',
        time: '1h',
        read: false
    },
    {
        id: 'n3',
        type: 'ASSIGN',
        user: 'Sistema',
        itemId: 'pi4',
        title: 'Nuevo pendiente asignado',
        description: 'Se te ha asignado "Reparación de pintura en Muro Norte".',
        time: '3h',
        read: true
    },
    {
        id: 'n4',
        type: 'SYSTEM',
        title: 'Reporte Diario Generado',
        description: 'El reporte de avance del día 23 Oct ya está disponible.',
        time: '5h',
        read: true
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleApprove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Simulate API call
    setNotifications(prev => prev.filter(n => n.id !== id));
    // Could add a toast here
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'MENTION') return n.type === 'MENTION';
    if (activeTab === 'UNREAD') return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
        case 'APPROVAL': return 'verified_user';
        case 'MENTION': return 'alternate_email';
        case 'ASSIGN': return 'assignment_ind';
        default: return 'info';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
        case 'APPROVAL': return 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400';
        case 'MENTION': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400';
        case 'ASSIGN': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400';
        default: return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-24 overflow-y-auto">
        <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Pendientes (Notificaciones)</h2>
                <button onClick={handleMarkAllRead} className="text-primary text-sm font-semibold hover:text-primary-dark">Marcar leídos</button>
            </div>
        </header>
        
        <div className="px-4 py-3 sticky top-[60px] z-40 bg-background-light dark:bg-background-dark">
            <div className="flex h-10 w-full items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 p-1">
                <button 
                    onClick={() => setActiveTab('ALL')}
                    className={`flex-1 rounded-md text-xs font-semibold h-full transition-all ${activeTab === 'ALL' ? 'bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Todos
                </button>
                <button 
                    onClick={() => setActiveTab('MENTION')}
                    className={`flex-1 rounded-md text-xs font-semibold h-full transition-all ${activeTab === 'MENTION' ? 'bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Menciones
                </button>
                <button 
                    onClick={() => setActiveTab('UNREAD')}
                    className={`flex-1 rounded-md text-xs font-semibold h-full transition-all ${activeTab === 'UNREAD' ? 'bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Sin leer
                </button>
            </div>
        </div>

        <div className="p-4 space-y-4">
            {activeTab === 'ALL' && <h3 className="font-bold text-lg">Hoy</h3>}
            
            {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                    <p className="text-sm">No tienes notificaciones nuevas.</p>
                </div>
            ) : (
                filteredNotifications.map((notif) => (
                    <div 
                        key={notif.id} 
                        className={`bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border ${!notif.read ? 'border-primary/30 dark:border-primary/30' : 'border-slate-200 dark:border-transparent'} relative pl-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer animate-fade-in`}
                    >
                        {/* Unread Indicator */}
                        {!notif.read && <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-xl"></div>}
                        
                        <div className="flex gap-3">
                            <div className={`${getColor(notif.type)} p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0`}>
                                <span className="material-symbols-outlined text-[20px]">{getIcon(notif.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="font-bold text-sm truncate pr-2">{notif.title}</p>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-snug">{notif.description}</p>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-3">
                                    {notif.canApprove && (
                                        <button 
                                            onClick={(e) => handleApprove(e, notif.id)}
                                            className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm shadow-primary/30 hover:bg-primary-dark active:scale-95 transition-all"
                                        >
                                            Aprobar
                                        </button>
                                    )}
                                    {notif.itemId && (
                                        <button 
                                            onClick={() => onVisitItem(notif.itemId!)}
                                            className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold px-4 py-2 rounded-lg active:scale-95 transition-all"
                                        >
                                            Revisar
                                        </button>
                                    )}
                                </div>
                            </div>
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

export default Notifications;