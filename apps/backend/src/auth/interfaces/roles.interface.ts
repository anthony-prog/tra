export enum UserRole {
  OPERADOR = 'operador',
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  MONITOR = 'monitor',
}

export interface AuthenticatedUser {
  id_usuario: string;
  nombre_usuario: string;
  rol: UserRole;
}
