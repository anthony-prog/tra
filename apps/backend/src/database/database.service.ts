import { Injectable, Logger } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

interface ExtendedPoolClient extends PoolClient {
  lastQuery?: unknown[];
}

type QueryFunction = (...args: unknown[]) => Promise<QueryResult>;
type ReleaseFunction = () => void;

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor() {
    // Si usas docker para la base de datos, el codigo seria se esta forma:
    // this.pool = new Pool({
    //   user: process.env.DB_USER || 'postgres',
    //   host: process.env.DB_HOST || 'localhost',
    //   database: process.env.DB_NAME || 'transporte',
    //   password: process.env.DB_PASSWORD || 'postgres',
    //   port: parseInt(process.env.DB_PORT || '5433'),
    // });

    // Si usas una base de datos local, el codigo seria se esta forma:
    this.pool = new Pool({
      user: process.env.DB_USER || 'postgres', // Cambialo por tu usuario de la base de datos local
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'transporte', // Cambialo por el nombre de tu base de datos local. Nota: Ya debe existir la base de datos, si no existe creala manualmente.
      password: process.env.DB_PASSWORD || '12345', // Cambialo por tu contraseña de la base de datos local
      port: parseInt(process.env.DB_PORT || '5432'), // Cambialo por el puerto de tu base de datos local, usualmente es 5432
    });
  }

  /**
   * Ejecuta una consulta a la base de datos
   * @param text - El texto de la consulta
   * @param params - Los parámetros de la consulta
   * @returns El resultado de la consulta
   */
  async query(text: string, params?: unknown[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      console.log('res', res);
      const duration = (Date.now() - start) / 1000;
      Logger.debug('Query ejecutada', {
        text,
        duracion: `${duration.toFixed(2)} segundos`,
        filas: res.rowCount,
      });
      return res;
    } catch (error) {
      Logger.error('Error en la consulta:', error);
      throw error;
    }
  }

  /**
   * Obtiene un cliente de la conexión a la base de datos, util para transacciones
   * @returns El cliente de la conexión a la base de datos
   */
  async getClient(): Promise<ExtendedPoolClient> {
    const client = (await this.pool.connect()) as ExtendedPoolClient;
    const originalQuery = client.query.bind(client) as QueryFunction;
    const originalRelease = client.release.bind(client) as ReleaseFunction;

    client.query = (...args: unknown[]): Promise<QueryResult> => {
      client.lastQuery = args;
      return originalQuery(...args);
    };

    client.release = (): void => {
      client.query = originalQuery;
      client.release = originalRelease;
      originalRelease();
    };

    return client;
  }
}
