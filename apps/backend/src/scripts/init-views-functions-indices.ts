import { DatabaseService } from '../database/database.service';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Inicializa las vistas, funciones e índices de la base de datos
 * @returns void
 * @throws Error si ocurre un error durante la inicialización
 */
async function initializeViewsFunctionsIndices() {
  try {
    const dbService = new DatabaseService();
    const scriptsDir = path.join(__dirname, '../../init-scripts');

    console.log('🚀 Iniciando la creación de vistas, funciones e índices...');

    // Ejecutar vistas
    console.log('📊 Creando vistas...');
    const viewsSql = fs.readFileSync(
      path.join(scriptsDir, '03-views.sql'),
      'utf8',
    );
    await dbService.query(viewsSql);
    console.log('✅ Vistas creadas exitosamente');

    // Ejecutar funciones
    console.log('⚙️ Creando funciones...');
    const functionsSql = fs.readFileSync(
      path.join(scriptsDir, '04-functions.sql'),
      'utf8',
    );
    await dbService.query(functionsSql);
    console.log('✅ Funciones creadas exitosamente');

    // Ejecutar índices
    console.log('🔍 Creando índices...');
    const indicesSql = fs.readFileSync(
      path.join(scriptsDir, '05-indices.sql'),
      'utf8',
    );
    await dbService.query(indicesSql);
    console.log('✅ Índices creados exitosamente');

    console.log('✨ Vistas, funciones e índices inicializados exitosamente');
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    throw error;
  }
}

// Ejecutar la función
initializeViewsFunctionsIndices().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});
