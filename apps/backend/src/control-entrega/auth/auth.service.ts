// src/control-entrega/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

interface User {
  id_usuario: string;
  nombre_usuario: string;
  contrasena: string;
}

interface UserResponse {
  id: string;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserResponse | null> {
    const client = await this.db.getClient();

    const result = await client.query(
      'SELECT id_usuario, nombre_usuario, contrasena FROM Usuario WHERE nombre_usuario = $1',
      [username],
    );

    // Tipado explícito del usuario
    const user: User | undefined = result.rows[0];

    // Verificamos que exista el usuario antes de acceder a propiedades
    if (!user) {
      console.warn('Usuario no encontrado:', username);
      return null;
    }

    const isBcryptHash =
      user.contrasena.startsWith('$2a$') ||
      user.contrasena.startsWith('$2b$') ||
      user.contrasena.startsWith('$2y$');

    if (isBcryptHash) {
      const passwordMatch = await bcrypt.compare(password, user.contrasena);
      if (!passwordMatch) {
        console.warn('Contraseña incorrecta (bcrypt):', username);
        return null;
      }
    } else {
      // Comparación directa (sólo si temporalmente se permiten contraseñas en texto plano)
      if (password !== user.contrasena) {
        console.warn('Contraseña incorrecta (texto plano):', username);
        return null;
      }
    }

    // Si pasó la validación, devolvemos el usuario con los campos esperados
    return {
      id: user.id_usuario,
      username: user.nombre_usuario,
    };
  }

}
