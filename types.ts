export enum Role {
  CREATOR = 'Creador',
  EXECUTOR = 'Ejecutor',
  VERIFIER = 'Verificador',
  DIRECTOR = 'Director',
  AUDITOR = 'Interventor (Externo)'
}

export enum Status {
  OPEN = 'Abierto', // Creado, esperando ejecución
  EXECUTED = 'Ejecutado', // Ejecutor reportó, espera verificación
  VERIFIED = 'Verificado', // Verificador aprobó, espera director
  TECHNICAL_CLOSE = 'Cierre Técnico', // Director aprobó, espera interventor
  CLOSED = 'Cerrado', // Interventor finalizó
  REJECTED = 'Rechazado' // Devuelto a etapa anterior
}

export enum Priority {
  A = 'Tipo A (Crítico)',
  B = 'Tipo B (Importante)',
  C = 'Tipo C (Menor)'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Nuevo campo para clave de acceso
  role: Role;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  status: 'Activo' | 'Revisión' | 'Espera' | 'Finalizado';
  progress: number;
  image: string;
  itemsTotal: number;
  itemsCompleted: number;
}

export interface System {
  id: string;
  projectId: string;
  name: string;
  code: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export type HistoryAction = 'CREATE' | 'UPDATE' | 'STATUS_CHANGE' | 'COMMENT' | 'ASSIGN' | 'IMAGE_ADD';

export interface HistoryEvent {
  id: string;
  action: HistoryAction;
  description: string;
  userId: string;
  userName: string;
  userAvatar: string; // Typically a URL
  userRole: string;
  timestamp: string;
  meta?: {
    prevStatus?: Status;
    newStatus?: Status;
    fieldChanged?: string;
  };
}

export interface PunchItem {
  id: string;
  projectId: string;
  systemId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignedTo: string; // User ID or Name
  createdBy: string;
  createdAt: string;
  // dueDate removed as requested
  location: string;
  images: { url: string; label: string }[];
  comments: Comment[];
  history: HistoryEvent[];
}

export type ViewState = 'LOGIN' | 'PROJECTS' | 'SYSTEMS' | 'PUNCHLIST' | 'ITEM_DETAIL' | 'ITEM_FORM' | 'PROFILE' | 'DASHBOARD' | 'NOTIFICATIONS' | 'AI_GEN';