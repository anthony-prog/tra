import { DatabaseService } from '../database/database.service';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Inicializa la base de datos con los scripts SQL
 * @returns void
 * @throws Error si ocurre un error durante la inicialización
 */
async function initializeDatabase() {
  try {
    const dbService = new DatabaseService();
    const scriptsDir = path.join(__dirname, '../../init-scripts');

    // Leer todos los archivos .sql del directorio
    const files = fs
      .readdirSync(scriptsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log('Iniciando ejecución de scripts SQL...');

    for (const file of files) {
      console.log(`Ejecutando script: ${file}`);
      const filePath = path.join(scriptsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      try {
        await dbService.query(sql);
        console.log(`✅ Script ${file} ejecutado exitosamente`);
      } catch (error) {
        console.error(`❌ Error ejecutando script ${file}:`, error);
        throw error;
      }
    }

    console.log('✅ Todos los scripts se ejecutaron correctamente');
  } catch (error) {
    console.error(
      'Error durante la inicialización de la base de datos:',
      error,
    );
    process.exit(1);
  }
}

// Ejecutar la función
(async () => {
  await initializeDatabase();
})().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
