import { DatabaseService } from '../database/database.service';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import * as Papa from 'papaparse';

/**
 * Interfaz para errores de importación
 */
interface ImportError {
  table: string;
  error: string;
  columnas: string[];
  valores_ejemplo: Record<string, any>;
  timestamp: string;
}

/**
 * Orden específico de procesamiento de archivos CSV
 * @type {string[]}
 */
const CSV_PROCESSING_ORDER = [
  'cliente.csv',
  'usuario.csv',
  'vehiculo.csv',
  'conductor.csv',
  'orden_entrega.csv',
  'producto.csv',
  'detalle_orden.csv',
  'carga.csv',
  'detalle_carga.csv',
  'punto_entrega.csv',
  'tramo_ruta.csv',
  'plan_entrega.csv',
  'detalle_plan_entrega.csv',
  'asignacion_transporte.csv',
  'catalogo_condicion.csv',
  'condicion_despacho.csv',
  'resultado_condicion_despacho.csv',
  'detalle_resultado_condicion.csv',
  'rechazo_despacho.csv',
  'despacho.csv',
  'monitoreo_ruta.csv',
  'incidencia.csv',
  'solucion_incidencia.csv',
  'entrega.csv',
  'detalle_entrega.csv',
  'reclamo.csv',
  'solucion_reclamo.csv',
  'evidencia.csv',
];

/**
 * Ruta del archivo de errores
 * @type {string}
 */
const errorLogPath = path.join(__dirname, '../../error-log.json');

/**
 * Espera a que PostgreSQL esté listo
 * @param dbService - Instancia de DatabaseService
 * @param maxRetries - Número máximo de intentos
 * @returns void
 * @throws Error si PostgreSQL no está disponible después de múltiples intentos
 */
async function waitForDatabase(
  dbService: DatabaseService,
  maxRetries: number = 60,
): Promise<void> {
  console.log('⏳ Esperando a que PostgreSQL esté listo...');

  for (let i = 0; i < maxRetries; i++) {
    try {
      await dbService.query('SELECT 1');
      console.log('✅ PostgreSQL está listo');
      return;
    } catch {
      console.log(
        `⏳ Intento ${i + 1}/${maxRetries}: PostgreSQL no está listo, esperando...`,
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  throw new Error(
    'PostgreSQL no está disponible después de múltiples intentos',
  );
}

/**
 * Importa datos desde archivos CSV a la base de datos
 * @param recreateTables Si es true, recrea las tablas antes de importar
 * @returns void
 * @throws Error si ocurre un error durante la importación
 */
async function importCSVData(recreateTables: boolean = true) {
  const errors: ImportError[] = [];

  try {
    const dbService = new DatabaseService();

    await waitForDatabase(dbService);

    if (recreateTables) {
      console.log('Recreando tablas...');
      const initScriptPath = path.join(
        __dirname,
        '../../init-scripts/01-create-tables.sql',
      );
      const initScript = fs.readFileSync(initScriptPath, 'utf8');

      try {
        await dbService.query(initScript);
      } catch (error) {
        console.error('Error creando tablas:', error);
        throw error;
      }

      console.log('✅ Tablas recreadas exitosamente');
    }

    const isDocker =
      process.env.NODE_ENV === 'production' || fs.existsSync('/app');
    const csvDir = isDocker
      ? '/app/datos-csv'
      : path.join(__dirname, '../../datos-csv');

    if (!fs.existsSync(csvDir)) {
      console.error(`❌ El directorio ${csvDir} no existe`);
      process.exit(1);
    }

    console.log('Iniciando importación de datos desde CSV...');

    for (const fileName of CSV_PROCESSING_ORDER) {
      const filePath = path.join(csvDir, fileName);

      if (!fs.existsSync(filePath)) {
        console.log(
          `⚠️ Archivo ${fileName} no encontrado, continuando con el siguiente...`,
        );
        continue;
      }

      console.log(`Procesando archivo: ${fileName}`);
      const fileContent = fs.readFileSync(filePath, 'utf8');

      const result: any = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (result?.errors && result.errors.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.error(`Error parseando ${fileName}:`, result.errors);
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const records: Record<string, string>[] = result?.data || [];

      if (records.length === 0) {
        console.log(`⚠️ Archivo ${fileName} está vacío, continuando...`);
        continue;
      }

      const tableName =
        fileName.replace('.csv', '').charAt(0).toLowerCase() +
        fileName.replace('.csv', '').slice(1);

      const columns = Object.keys(records[0]);

      console.log(`Insertando datos en la tabla ${tableName}...`);

      try {
        const client = await dbService.getClient();

        try {
          await client.query('BEGIN');

          if (tableName === 'usuario') {
            console.log('🔐 Encriptando contraseñas para usuarios...');

            for (const record of records) {
              const values = await Promise.all(
                columns.map(async (column) => {
                  const value = record[column];

                  if (column === 'contrasena' && typeof value === 'string') {
                    const saltRounds = 10;
                    return await bcrypt.hash(value, saltRounds);
                  }

                  return value;
                }),
              );

              const placeholders = columns
                .map((_, i) => `$${i + 1}`)
                .join(', ');

              const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
              await client.query(query, values);
            }
            console.log(
              `✅ Datos importados exitosamente en ${tableName} con contraseñas encriptadas`,
            );
          } else if (tableName === 'tramo_ruta') {
            for (const record of records) {
              const values = columns.map((column) => {
                const value = record[column];

                if (
                  column === 'ruta_planificada' &&
                  typeof value === 'string'
                ) {
                  const puntos = value
                    .replace(/^\{|\}$/g, '')
                    .split(/\),\s*\(/)
                    .map((p) => `"(${p.replace(/[()]/g, '')})"`);
                  return `{${puntos.join(',')}}`;
                }

                return value;
              });

              const placeholders = columns
                .map((col, i) =>
                  col === 'ruta_planificada'
                    ? `$${i + 1}::point[]`
                    : `$${i + 1}`,
                )
                .join(', ');

              const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
              await client.query(query, values);
            }
            console.log(`✅ Datos importados exitosamente en ${tableName}`);
          } else {
            const batchSize = 100;
            for (let i = 0; i < records.length; i += batchSize) {
              const batch = records.slice(i, i + batchSize);

              const placeholders = batch
                .map((_, index) => {
                  const rowPlaceholders = columns
                    .map(
                      (_, colIndex) =>
                        `$${index * columns.length + colIndex + 1}`,
                    )
                    .join(', ');
                  return `(${rowPlaceholders})`;
                })
                .join(', ');

              const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${placeholders}`;

              const values = batch.flatMap((record) =>
                columns.map((column) => {
                  return record[column];
                }),
              );

              await client.query(query, values);
            }
            console.log(`✅ Datos importados exitosamente en ${tableName}`);
          }

          await client.query('COMMIT');
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `Error insertando registros en ${tableName}:`,
          errorMessage,
        );

        errors.push({
          table: tableName,
          error: errorMessage,
          columnas: columns,
          valores_ejemplo: records[0] || {},
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (errors.length > 0) {
      fs.writeFileSync(errorLogPath, JSON.stringify(errors, null, 2));
      console.log(
        `❌ Se encontraron ${errors.length} errores. Ver detalles en: ${errorLogPath}`,
      );
    } else {
      console.log('✅ Todos los archivos CSV fueron procesados correctamente');
    }
  } catch (error) {
    console.error('Error durante la importación de datos:', error);
    process.exit(1);
  }
}

const recreateTables = process.argv.includes('--recreate-tables');
(async () => {
  await importCSVData(recreateTables);
})().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
