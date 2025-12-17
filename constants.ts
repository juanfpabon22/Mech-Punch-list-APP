import { Project, PunchItem, Role, Status, Priority, User, System } from './types';

// Definición de Usuarios Específicos
export const USERS: User[] = [
  // Creador (1)
  {
    id: 'creator1',
    name: 'Juan Camilo Palacios',
    email: 'jcp.arq@constructora.com',
    role: Role.CREATOR,
    avatar: 'https://ui-avatars.com/api/?name=Juan+Camilo+Palacios&background=0D8ABC&color=fff'
  },
  // Ejecutores (2)
  {
    id: 'exec1',
    name: 'Supervisor 1',
    email: 'supervisor1@constructora.com',
    role: Role.EXECUTOR,
    avatar: 'https://ui-avatars.com/api/?name=Supervisor+1&background=6366f1&color=fff'
  },
  {
    id: 'exec2',
    name: 'Supervisor 2',
    email: 'supervisor2@constructora.com',
    role: Role.EXECUTOR,
    avatar: 'https://ui-avatars.com/api/?name=Supervisor+2&background=6366f1&color=fff'
  },
  // Verificadores (2)
  {
    id: 'ver1',
    name: 'Ingeniero de Calidad 1',
    email: 'calidad1@constructora.com',
    role: Role.VERIFIER,
    avatar: 'https://ui-avatars.com/api/?name=Ing+Calidad+1&background=3b82f6&color=fff'
  },
  {
    id: 'ver2',
    name: 'Ingeniero de Calidad 2',
    email: 'calidad2@constructora.com',
    role: Role.VERIFIER,
    avatar: 'https://ui-avatars.com/api/?name=Ing+Calidad+2&background=3b82f6&color=fff'
  },
  // Directores (2)
  {
    id: 'dir1',
    name: 'Luis Narvaez',
    email: 'luis.narvaez@constructora.com',
    role: Role.DIRECTOR,
    avatar: 'https://ui-avatars.com/api/?name=Luis+Narvaez&background=0f766e&color=fff'
  },
  {
    id: 'dir2',
    name: 'Jhon Castaño',
    email: 'jhon.castano@constructora.com',
    role: Role.DIRECTOR,
    avatar: 'https://ui-avatars.com/api/?name=Jhon+Castano&background=0f766e&color=fff'
  },
  // Interventores (2)
  {
    id: 'aud1',
    name: 'Juan Camilo Palacios (Ext)',
    email: 'jcp.interventor@externo.com',
    role: Role.AUDITOR,
    avatar: 'https://ui-avatars.com/api/?name=Juan+Camilo+P&background=16a34a&color=fff'
  },
  {
    id: 'aud2',
    name: 'Juan Pabon',
    email: 'juan.pabon@externo.com',
    role: Role.AUDITOR,
    avatar: 'https://ui-avatars.com/api/?name=Juan+Pabon&background=16a34a&color=fff'
  }
];

export const CURRENT_USER: User = USERS[0]; // Default for initial load if needed

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
  },
  {
    id: 'p2',
    name: 'Oficinas Centro',
    location: 'CDMX, MX • ID #4025',
    status: 'Revisión',
    progress: 90,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtGEIA4-DZbfH5bM5btackm73wU-WC4uoYdy1zYFuATbPlxQiw34o0vqlHSzKw-Dnln-XA6k3p75CFE3-Cvq9bd6Ni5c9DKEhcsnQ5FDosKDokcxyXvMb2fLeCVJjv6A4svSFAIiRcXf8E1ehwH4pCxUvirxrbI5KMAPCYf9jiHCsO65lpfdwSpF3YJ7h9YVWPKd0iWIXkW4WPuj1ipKqohmX38QBPE7HosFnXfCy4bH7Uh4wruxXPHUqv_azi8hL_4xgzH3x8HOo',
    itemsTotal: 80,
    itemsCompleted: 72
  },
  {
    id: 'p3',
    name: 'Torre Norte',
    location: 'Monterrey, MX • ID #4030',
    status: 'Espera',
    progress: 10,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIZJRQY4sXgjwk97JOh8DD6Rytr1CIntvpBD5753uHEE1JWmMM5d5MUhKwbqBjHFHfqL-Px3B2zvTX6knZ_Zp0jqtRM0JZiKCibEWvnK_YpRL1TWYrxe8fp0w49Ayx7flYOlmM3Pj5kKCHfWLpvUmqt6KTskjtZC2QnrLYloXgzgi7t-N9G1TvXqE1buPXjGypcoS4MIx-DKWtEn0ZBPofbO2oxtJxE-XSt5mWfGeqLxh1S5rWGKmH_sEQsbvU7tpnPZo61NUfTcs',
    itemsTotal: 50,
    itemsCompleted: 5
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
        userId: 'creator1',
        userName: 'Juan Camilo Palacios',
        userRole: 'Creador',
        userAvatar: 'https://ui-avatars.com/api/?name=Juan+Camilo+Palacios&background=0D8ABC&color=fff',
        timestamp: '2023-10-24 09:30 AM'
      }
    ]
  },
  {
    id: 'pi2',
    projectId: 'p1',
    systemId: 's1',
    title: 'Falta aislamiento térmico',
    description: 'Tramo de 2 metros sin aislamiento en retorno de condensados.',
    status: Status.EXECUTED,
    priority: Priority.B,
    assignedTo: 'Supervisor 2',
    createdBy: 'Juan Camilo Palacios',
    createdAt: '2023-10-23',
    location: 'Nivel 0.00 - Zona Bombas',
    images: [
      { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzXNv93ZoSql06QI4SKmoEqf214zi5QQq73bdAuhE8ZxBdqgiUJp57OTEV36ncyKFL9ALhRnkEQT__7vxefOUxP4tbDL6EshXfwCYQ6x71ck2C-NqwHd6A6E0FYfH2If7r46v1ljo5qhDNVfPWjHUFu5Uy1noGq64G4eWANDnPOEcNaCbfAdFopoUH30DhGLOzpFdfKxzCRS4HUJlfxD7PeyqEegLzNbLFXs9w-C2w98dpI_iOx6vz3BrYEuWeEcKbRSZyJo-_WtQ', label: 'Evidencia' }
    ],
    comments: [],
    history: [
       {
        id: 'h1',
        action: 'CREATE',
        description: 'Item creado',
        userId: 'creator1',
        userName: 'Juan Camilo Palacios',
        userRole: 'Creador',
        userAvatar: 'https://ui-avatars.com/api/?name=Juan+Camilo+Palacios&background=0D8ABC&color=fff',
        timestamp: '2023-10-23 14:20 PM'
      },
      {
        id: 'h2',
        action: 'STATUS_CHANGE',
        description: 'Reportó ejecución del pendiente',
        userId: 'exec2',
        userName: 'Supervisor 2',
        userRole: 'Ejecutor',
        userAvatar: 'https://ui-avatars.com/api/?name=Supervisor+2&background=6366f1&color=fff',
        timestamp: '2023-10-24 08:00 AM',
        meta: {
            prevStatus: Status.OPEN,
            newStatus: Status.EXECUTED
        }
      }
    ]
  },
  {
    id: 'pi3',
    projectId: 'p1',
    systemId: 's1',
    title: 'Limpieza de área de caldera',
    description: 'Remoción de material sobrante tras montaje mecánico.',
    status: Status.CLOSED,
    priority: Priority.C,
    assignedTo: 'Supervisor 1',
    createdBy: 'Juan Camilo Palacios',
    createdAt: '2023-10-20',
    location: 'Nave Principal',
    images: [
        { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV8Sh2-E29I-kuYENCNXQkBl-VzF_0lfx7V08-gVuQlYgXZ5YSkyQdqxaWLQealLcYvXvNzmXLePfs_3y3VsEuR1DLOclnckz2-pskIESQ2_y2HlcKfAJ9eOlWNm8qkiaUq7lBvqMP3Fyp7r78Uvsb-ZWgVS0Srm0xNnzPpX2UQInMQmiqVSry6ejkRyGL-PgesUNU8rVO-Ss18_FrSPiWYNRI7S2uNFxx142uG-H22tI0TGErUTq_k46pTaFj_ewjfd9RmCPyS38', label: 'Final'}
    ],
    comments: [],
    history: []
  },
  {
    id: 'pi4',
    projectId: 'p1',
    systemId: 's1',
    title: 'Retoque de pintura en estructura soporte',
    description: 'Se requiere pintura ignífuga en soporte S-204.',
    status: Status.VERIFIED,
    priority: Priority.A,
    assignedTo: 'Supervisor 1',
    createdBy: 'Juan Camilo Palacios',
    createdAt: '2023-10-24',
    location: 'Eje 4-B',
    images: [
      { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5LvNRQ-7wWtXNflUs5xmvUSKJijp2eq_h24kxpWPinC1I8PrBDTYmuNMsekWFu_NQ71bvPfRkUK1lwHyo2fIS1wM94odZuBycDV3Q0-BPvmxCw9eeqRaN-as6hozXWo0almyGOsC5sIBmyfgy6xp1rf33fFzEbRls7LNQjm-21wNI37uNnQiyYF_cu-tLXt8V7oBgm0D029cojBbELZ29rrAaPuFEeXRojduItYLigKareOuUoXbzUlI3BgI6hiJKBvctMYAkT50', label: 'Antes' },
      { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlEgoeXPZksA95PLkDCcrGGk3ikL4GUjIuxbMKx0Qz5haQtnE1BhqldsG5Ejh1mlnp_0XBjoQ3ynFqU7jqx_-jbboy_6yZFxh1q5_3zDvimi8tOWyfI8EjVcz17uxvt4lcFPqGGSP3LMDuWMS4FjSSUr66x_W3KQL4k5GB0RDI0vXl1umpUtRh8T_tiLYT92F3DU3HE11D3lav9gyfvGgFAWNOIyl6be5d-eEAgJYlCWfiLavu7amxoK_FlGROCtgdZaBizTO_gsQ', label: 'Después' },
      { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR-t1J0KckCnC2_y6JQX5fGKElxfej2GhWh0u088ow-x5Cj_8l_xPCw73eki3B4ovqkHe0Rqr0v5UF-8B7uuxw8pFZguK5DINBkuuX9CezM6PBlb9lznH2eDH9YgSnpTNMtlv836z2I491uyv81YVErwnZ-mMkXMrUKVoXlHuuppyo061EwMSuJ-3wshkHHz2Q2Nyx6QVbqmwGz0TSPTiGC_4iphdE0lrKBz3crG69mGOj2iCPBnXnsWNzR9JJwUypC7nbTAEeRAI', label: 'Detalle' }
    ],
    comments: [],
    history: [
      {
        id: 'h1',
        action: 'CREATE',
        description: 'Item creado',
        userId: 'creator1',
        userName: 'Juan Camilo Palacios',
        userRole: 'Creador',
        timestamp: '2023-10-24 09:30 AM',
        userAvatar: 'https://ui-avatars.com/api/?name=Juan+Camilo+Palacios&background=0D8ABC&color=fff'
      },
       {
        id: 'h2',
        action: 'STATUS_CHANGE',
        description: 'Ejecución completada',
        userId: 'exec1',
        userName: 'Supervisor 1',
        userRole: 'Ejecutor',
        userAvatar: 'https://ui-avatars.com/api/?name=Supervisor+1&background=6366f1&color=fff',
        timestamp: '2023-10-25 10:00 AM',
        meta: { prevStatus: Status.OPEN, newStatus: Status.EXECUTED }
      },
      {
        id: 'h3',
        action: 'STATUS_CHANGE',
        description: 'Verificación aprobada',
        userId: 'ver1',
        userName: 'Ingeniero de Calidad 1',
        userRole: 'Verificador',
        userAvatar: 'https://ui-avatars.com/api/?name=Ing+Calidad+1&background=3b82f6&color=fff',
        timestamp: '2023-10-25 14:00 PM',
        meta: { prevStatus: Status.EXECUTED, newStatus: Status.VERIFIED }
      }
    ]
  }
];