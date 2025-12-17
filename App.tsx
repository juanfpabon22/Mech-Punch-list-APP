import React, { useState, useEffect } from 'react';
import { ViewState, Project, User, Role, PunchItem, HistoryAction, Status } from './types';
import { PROJECTS, USERS, SYSTEMS } from './constants';
import { StorageService } from './services/storage';

// Components
import SystemList from './components/SystemList';
import PunchList from './components/PunchList';
import PunchItemDetail from './components/PunchItemDetail';
import PunchItemForm from './components/PunchItemForm';
import ExecutiveSummary from './components/ExecutiveSummary';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import Login from './components/Login';
import BottomNav from './components/BottomNav';
import AIGenerator from './components/AIGenerator';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LOGIN');
  const [user, setUser] = useState<User | null>(null);
  
  // Data State (Database)
  const [items, setItems] = useState<PunchItem[]>([]);
  
  // Single Project Mode: Always use the first project
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]); 
  
  const [activeItem, setActiveItem] = useState<PunchItem | null>(null);
  const [activeSystemId, setActiveSystemId] = useState<string | null>(null);

  // Initialize DB on Load
  useEffect(() => {
    StorageService.init();
    setItems(StorageService.getItems());
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Directly go to Systems (Areas) as Home
    setView('SYSTEMS');
  };

  const navigateTo = (newView: ViewState) => {
    setView(newView);
  };

  const handleSavePunchItem = (formData: any) => {
    if (!user) return;

    const isNew = !activeItem;
    
    const newItem: PunchItem = {
      id: isNew ? `pi-${Date.now()}` : activeItem!.id,
      projectId: activeProject.id,
      systemId: formData.systemId,
      title: formData.title,
      description: formData.description,
      status: isNew ? Status.OPEN : (activeItem?.status || Status.OPEN),
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      createdBy: isNew ? user.name : (activeItem?.createdBy || user.name),
      createdAt: isNew ? new Date().toISOString().split('T')[0] : (activeItem?.createdAt || ''),
      // Date Logic removed here
      location: 'Ubicación General', // Simplified for form
      images: formData.images,
      comments: isNew ? [] : (activeItem?.comments || []),
      history: isNew ? [
        {
          id: `h-${Date.now()}`,
          action: 'CREATE' as HistoryAction,
          description: 'Item creado',
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          userAvatar: user.avatar,
          timestamp: new Date().toLocaleString()
        }
      ] : [
        ...(activeItem?.history || []),
        {
          id: `h-${Date.now()}`,
          action: 'UPDATE' as HistoryAction,
          description: 'Item actualizado',
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          userAvatar: user.avatar,
          timestamp: new Date().toLocaleString()
        }
      ]
    };

    const updatedList = StorageService.saveItem(newItem);
    setItems(updatedList);
    setView('PUNCHLIST');
  };

  // Helper to get active system details
  const activeSystem = activeSystemId ? SYSTEMS.find(s => s.id === activeSystemId) : null;
  
  // Filter items based on active system if selected
  const displayedItems = activeSystemId 
    ? items.filter(item => item.systemId === activeSystemId)
    : items;

  // Render logic based on state
  const renderContent = () => {
    switch (view) {
      case 'LOGIN':
        return <Login onLogin={handleLogin} />;
      case 'SYSTEMS':
        return <SystemList 
          project={activeProject} 
          currentUser={user!}
          onBack={() => {}} 
          onSelectSystem={(sId) => {
            setActiveSystemId(sId);
            setView('PUNCHLIST');
          }}
        />;
      case 'PUNCHLIST':
        return <PunchList 
          items={displayedItems} 
          project={activeProject}
          currentUser={user!}
          systemName={activeSystem?.name}
          onBack={() => {
            setActiveSystemId(null);
            setView('SYSTEMS');
          }}
          onSelectItem={(item) => {
            setActiveItem(item);
            setView('ITEM_DETAIL');
          }}
          onAddItem={() => {
            setActiveItem(null);
            setView('ITEM_FORM');
          }}
        />;
      case 'ITEM_DETAIL':
        return <PunchItemDetail 
          item={activeItem!} 
          currentUser={user!}
          onBack={() => setView('PUNCHLIST')}
          onEdit={() => setView('ITEM_FORM')}
        />;
      case 'ITEM_FORM':
        return <PunchItemForm 
          item={activeItem} 
          currentUser={user}
          onBack={() => setView(activeItem ? 'ITEM_DETAIL' : 'PUNCHLIST')}
          onSave={handleSavePunchItem}
        />;
      case 'DASHBOARD':
        return <ExecutiveSummary 
          project={activeProject} 
          items={items} 
          onBack={() => setView('SYSTEMS')} 
        />;
      case 'NOTIFICATIONS':
        return <Notifications 
          onVisitItem={(itemId) => {
            const item = items.find(i => i.id === itemId);
            if (item) {
              setActiveItem(item);
              setView('ITEM_DETAIL');
            } else {
              alert("El ítem no se encuentra.");
            }
          }}
          onAddItem={() => {
            setActiveItem(null);
            setView('ITEM_FORM');
          }}
          currentUser={user!}
        />;
      case 'PROFILE':
        return <Profile 
          user={user!} 
          onLogout={() => { setUser(null); setView('LOGIN'); }} 
        />;
      case 'AI_GEN':
        return <AIGenerator onBack={() => setView('SYSTEMS')} />;
      default:
        return <div className="p-4 text-white">404 View Not Found</div>;
    }
  };

  if (view === 'LOGIN') {
    return <Login onLogin={handleLogin} />;
  }

  const showBottomNav = !['LOGIN', 'ITEM_FORM', 'ITEM_DETAIL', 'AI_GEN'].includes(view);

  return (
    <div className="h-full flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
      {showBottomNav && (
        <BottomNav currentView={view} onNavigate={navigateTo} />
      )}
    </div>
  );
};

export default App;