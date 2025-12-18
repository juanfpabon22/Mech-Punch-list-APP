import { Project, PunchItem, Role, Status, Priority, User, System } from './types';

// Lista de Usuarios Actualizada según imagen
export const USERS: User[] = [
  {
    id: 'u1',
    name: 'Juan Camilo Palacios',
    email: 'j.palacios@empresa.com',
    password: 'JCP2025',
    role: Role.CREATOR,
    avatar: 'https://ui-avatars.com/api/?name=Juan+Camilo+Palacios&background=0D8ABC&color=fff'
  },
  {
    id: 'u2',
    name: 'Supervisor 1',
    email: 'supervisor1@empresa.com',
    password: 'SUPER123',
    role: Role.EXECUTOR,
    avatar: 'https://ui-avatars.com/api/?name=Supervisor+1&background=6366f1&color=fff'
  },
  {
    id: 'u3',
    name: 'Ingeniero control calidad',
    email: 'calidad@empresa.com',
    password: 'INGCAL321',
    role: Role.VERIFIER,
    avatar: 'https://ui-avatars.com/api/?name=Ing+Control+Calidad&background=3b82f6&color=fff'
  },
  {
    id: 'u4',
    name: 'Jhon Castaño',
    email: 'j.castano@empresa.com',
    password: 'DIR2026',
    role: Role.DIRECTOR,
    avatar: 'https://ui-avatars.com/api/?name=Jhon+Castano&background=0f766e&color=fff'
  },
  {
    id: 'u5',
    name: 'Luis Narvaez',
    email: 'l.narvaez@empresa.com',
    password: 'LNAR2233',
    role: Role.DIRECTOR,
    avatar: 'https://ui-avatars.com/api/?name=Luis+Narvaez&background=0f766e&color=fff'
  },
  {
    id: 'u6',
    name: 'Juan Pabon',
    email: 'j.pabon@empresa.com',
    password: 'JFPZ1987',
    role: Role.AUDITOR,
    avatar: 'https://ui-avatars.com/api/?name=Juan+Pabon&background=16a34a&color=fff'
  }
];

export const CURRENT_USER: User = USERS[0];

export const SYSTEMS: System[] = [
  { id: 's1', projectId: 'p1', name: 'Torre Norte - Piso 3', code: 'TN-03' },
  { id: 's2', projectId: 'p1', name: 'Torre Norte - Piso 4', code: 'TN-04' },
  { id: 's3', projectId: 'p1', name: 'Lobby Principal', code: 'LB-01' },
  { id: 's4', projectId: 'p1', name: 'Estacionamiento', code: 'PK-01' },
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Caldera de Biomasa HPB',
    location: 'Planta Industrial • ID #HPB-01',
    status: 'Activo',
    progress: 75,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnmqZ5OXjNgGqNRtxemTgt66J-Z99BWWhL4_R7EyLwWHmsQ1UKx6ET0z_RCKztHRyIAuogmLuGKGtJ386ij9z0RHK-Iq2K6m0hcfjumI6-ARaDYpwRtbPDbj_my9VFsCGTB6w5qZMrWCEFJvmpP0EhtDTKT7mkTQuAWiedcjqACrH7ansvudrQQtTEa3zBdRSvrhhSgTcn-q8GpEkiMRgnnw_z7uSOAgdbJh1mEo93pcZVx5I0EIHfFKIc-343vgcaI3WlFg1yuD8',
    itemsTotal: 145,
    itemsCompleted: 45
  }
];

export const PUNCH_ITEMS: PunchItem[] = [
  {
    id: 'pi1',
    projectId: 'p1',
    systemId: 's1',
    title: 'Fuga en tubería de alimentación',
    description: 'Se observa goteo constante en la unión bridada de la línea de 4".',
    status: Status.OPEN,
    priority: Priority.A,
    assignedTo: 'Supervisor 1',
    createdBy: 'Juan Camilo Palacios',
    createdAt: '2023-10-24',
    location: 'Nivel +3.50',
    images: [
      { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6Otvj_HQ0UkVh4o6BGXnAxKVPjrmAUPZia5JZNXgVZ7gHAM_-MxEnjqP_73Xrj6kCS0Dz3dsT74uE7ZgeJ5-Q7QlGO7WASUUEVYCxYrPCPEvkGe-5bt61PpJOz__1sMeSDYNxEYxap60C-QAag4CoolDjx4D8wq4P31HCMARYNr18AOpW1T2HCEayBSM-E5YQk6-exRGqviK3hYrI7xW75F6KAd8T79yAUec6YePP3k1XL5_fd0kzMaIBP0-pr5qP4rq7ViLEjD0', label: 'Antes' }
    ],
    comments: [
      { id: 'c1', author: 'Juan Camilo Palacios', avatar: 'https://ui-avatars.com/api/?name=Juan+Camilo+Palacios&background=0D8ABC&color=fff', text: 'Requiere ajuste de torque inmediato.', timestamp: 'Hace 2 horas' }
    ],
    history: [
      {
        id: 'h1',
        action: 'CREATE',
        description: 'Item creado y notificado',
        userId: 'u1',
        userName: 'Juan Camilo Palacios',
        userRole: 'Creador',
        userAvatar: 'https://ui-avatars.com/api/?name=Juan+Camilo+Palacios&background=0D8ABC&color=fff',
        timestamp: '2023-10-24 09:30 AM'
      }
    ]
  }
];