#!/bin/bash
PROJECT_ROOT="/d/DBD/bd251-grupo5/g5-app/apps/backend"

echo "🚀 Iniciando script de inicialización de base de datos..."

# Función para esperar a que PostgreSQL esté listo
wait_for_postgres() {
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    while ! nc -z postgres 5432; do
        echo "PostgreSQL no está listo aún, esperando..."
        sleep 2
    done
    echo "✅ PostgreSQL está listo!"
}

# Función para esperar a que los scripts de inicialización SQL terminen
wait_for_sql_init() {
    echo "⏳ Esperando a que los scripts SQL de inicialización terminen..."
    sleep 10  # Dar tiempo para que los scripts SQL se ejecuten
    echo "✅ Scripts SQL de inicialización completados"
}

# Función para ejecutar el script de importación CSV
run_csv_import() {
    echo "📝 Ejecutando script de importación CSV..."
    
    # Navegar al directorio del proyecto
    cd "$PROJECT_ROOT"

    # Verificar si el script existe
    if [ ! -f "src/scripts/import-csv.ts" ]; then
        echo "❌ Script de importación CSV no encontrado"
        return 1
    fi
    
    # Configurar entorno de producción para usar la ruta correcta de CSV
    export NODE_ENV=production
    
    # Ejecutar el script de importación CSV
    echo "🔄 Importando datos desde archivos CSV..."
    npx ts-node src/scripts/import-csv.ts --recreate-tables=false
    
    if [ $? -eq 0 ]; then
        echo "✅ Importación CSV completada exitosamente"
    else
        echo "❌ Error durante la importación CSV"
        return 1
    fi
}

# Función para verificar la salud de la base de datos
check_database_health() {
    echo "🏥 Verificando salud de la base de datos..."
    
    # Intentar conectarse a la base de datos
    if PGPASSWORD=12345 psql -h localhost -U postgres -d transporte -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Base de datos está funcionando correctamente"
    else
        echo "⚠️ No se pudo verificar la base de datos"
    fi
}
# PGPASSWORD=12345 Cambialo por tu contraseña de la base de datos local

# Ejecutar las funciones en orden
# wait_for_postgres
wait_for_sql_init
check_database_health
run_csv_import

echo "🎉 Inicialización de base de datos completada!" 