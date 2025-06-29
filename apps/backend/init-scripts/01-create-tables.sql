-- Eliminar tablas
DROP TABLE IF EXISTS Evidencia CASCADE;
DROP TABLE IF EXISTS Solucion_reclamo CASCADE;
DROP TABLE IF EXISTS Reclamo CASCADE;
DROP TABLE IF EXISTS Detalle_entrega CASCADE;
DROP TABLE IF EXISTS Entrega CASCADE;
DROP TABLE IF EXISTS Solucion_incidencia CASCADE;
DROP TABLE IF EXISTS Incidencia CASCADE;
DROP TABLE IF EXISTS Monitoreo_ruta CASCADE;
DROP TABLE IF EXISTS Despacho CASCADE;
DROP TABLE IF EXISTS Rechazo_Despacho CASCADE;
DROP TABLE IF EXISTS Detalle_resultado_condicion CASCADE;
DROP TABLE IF EXISTS Resultado_condicion_despacho CASCADE;
DROP TABLE IF EXISTS Condicion_despacho CASCADE;
DROP TABLE IF EXISTS Asignacion_transporte CASCADE;
DROP TABLE IF EXISTS Detalle_plan_entrega CASCADE;
DROP TABLE IF EXISTS Plan_entrega CASCADE;
DROP TABLE IF EXISTS Tramo_ruta CASCADE;
DROP TABLE IF EXISTS Punto_entrega CASCADE;
DROP TABLE IF EXISTS Detalle_carga CASCADE;
DROP TABLE IF EXISTS Carga CASCADE;
DROP TABLE IF EXISTS Detalle_Orden CASCADE;
DROP TABLE IF EXISTS Producto CASCADE;
DROP TABLE IF EXISTS Orden_entrega CASCADE;
DROP TABLE IF EXISTS Conductor CASCADE;
DROP TABLE IF EXISTS Vehiculo CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Cliente CASCADE;
DROP TABLE IF EXISTS Catalogo_condicion CASCADE;

-- Eliminar tipos si existen
DROP TYPE IF EXISTS tipo_cliente CASCADE;
DROP TYPE IF EXISTS tipo_negocio CASCADE;
DROP TYPE IF EXISTS tipo_vehiculo CASCADE;
DROP TYPE IF EXISTS tipo_licencia CASCADE;
DROP TYPE IF EXISTS genero CASCADE;
DROP TYPE IF EXISTS rol_usuario CASCADE;
DROP TYPE IF EXISTS nivel_prioridad CASCADE;
DROP TYPE IF EXISTS tipo_producto CASCADE;
DROP TYPE IF EXISTS tipo_conservacion CASCADE;
DROP TYPE IF EXISTS hub CASCADE;
DROP TYPE IF EXISTS tipo_punto CASCADE;
DROP TYPE IF EXISTS estado_asignacion CASCADE;
DROP TYPE IF EXISTS tipo_condicion_enum CASCADE;
DROP TYPE IF EXISTS tipo_accion_enum CASCADE;
DROP TYPE IF EXISTS estado_accion_enum CASCADE;
DROP TYPE IF EXISTS estado_recorrido_enum CASCADE;
DROP TYPE IF EXISTS estado_compartimento CASCADE;
DROP TYPE IF EXISTS tipo_incidencia CASCADE;
DROP TYPE IF EXISTS severidad CASCADE;
DROP TYPE IF EXISTS estado_incidencia CASCADE;
DROP TYPE IF EXISTS estado_entrega_enum CASCADE;
DROP TYPE IF EXISTS estado_reclamo_enum CASCADE;
DROP TYPE IF EXISTS tipo_reclamo_enum CASCADE;
DROP TYPE IF EXISTS estado_solucion_enum CASCADE;
DROP TYPE IF EXISTS tipo_evidencia_enum CASCADE;
DROP TYPE IF EXISTS tipo_archivo_enum CASCADE;

--Creacion de types
CREATE TYPE tipo_cliente AS ENUM ('empresa', 'persona_natural');
CREATE TYPE tipo_negocio AS ENUM ('restaurante', 'hotel', 'supermercado', 'distribuidor', 'otro');
CREATE TYPE tipo_vehiculo AS ENUM ('camion', 'camioneta', 'furgoneta');
CREATE TYPE tipo_licencia AS ENUM ('A', 'B', 'C');
CREATE TYPE genero AS ENUM ('M', 'F', 'O');
CREATE TYPE rol_usuario AS ENUM ('operador', 'admin', 'supervisor','monitor');
CREATE TYPE nivel_prioridad AS ENUM (
    'baja',      -- Para entregas no urgentes
    'media',     -- Para entregas normales
    'alta',      -- Para entregas urgentes
    'critica'    -- Para entregas de máxima urgencia
);
CREATE TYPE tipo_producto AS ENUM ('pollo', 'pavo', 'embutido', 'cerdo', 'huevo');
CREATE TYPE tipo_conservacion AS ENUM ('refrigerado', 'congelado', 'seco');
CREATE TYPE hub AS ENUM (
    'Esmeralda',
    'Independencia',
    'Huaral',
    'Chincha'
);
CREATE TYPE tipo_punto AS ENUM ('terminal', 'cliente');
CREATE TYPE estado_asignacion AS ENUM ('pendiente', 'en_proceso', 'completada', 'cancelada');
CREATE TYPE tipo_condicion_enum AS ENUM (
    'vehiculo',           -- Problemas con el vehículo
    'conductor',          -- Problemas con el conductor
    'carga',             -- Problemas con la carga
    'ruta',              -- Problemas con la ruta
    'documentacion'   -- Problemas con documentaciónVe
);
CREATE TYPE tipo_accion_enum AS ENUM (
    'reasignar_vehiculo',    -- Asignar a otro vehículo
    'reasignar_conductor',   -- Asignar a otro conductor
    'mover_carga',          -- Mover la carga a otro lugar
    'reprogramar',          -- Reprogramar la entrega
    'cancelar'            -- Cancelar la asignación
);
CREATE TYPE estado_accion_enum AS ENUM (
    'pendiente',      -- Acción por realizar
    'en_proceso',     -- Acción en ejecución
    'completada',     -- Acción finalizada
    'cancelada'       -- Acción cancelada
);
CREATE TYPE estado_compartimento AS ENUM ('cerrado', 'abierto');
CREATE TYPE estado_incidencia AS ENUM ('pendiente', 'en_proceso', 'resuelta');
CREATE TYPE tipo_incidencia AS ENUM (
    'accidente', 
    'averia_vehiculo', 
    'desvio_ruta', 
    'problema_temperatura', 
    'retraso', 
    'clima_adverso',
    'problema_trafico',
    'apertura_no_autorizada',
    'otro'
);
CREATE TYPE severidad AS ENUM ('baja', 'media', 'alta', 'critica');
CREATE TYPE estado_reclamo_enum AS ENUM (
    'pendiente',           -- Reclamo recién registrado
    'en_revision',         -- En proceso de revisión
    'en_proceso',          -- Se está trabajando en la solución
    'solucionado',         -- Reclamo resuelto
    'rechazado',           -- Reclamo no procede
    'en_pausa'            -- Reclamo pausado temporalmente
);
CREATE TYPE tipo_reclamo_enum AS ENUM (
    'producto_mal_estado',     -- Producto en mal estado
    'producto_equivocado',     -- Producto incorrecto
    'pedido_incompleto',       -- Falta parte del pedido
    'no_llego_producto',       -- No llegó el producto
    'temperatura_incorrecta',  -- Problema con temperatura
    'daño_empaque',           -- Empaque dañado
    'retraso_entrega',        -- Entrega tardía
    'otro'                    -- Otro tipo de reclamo
);
CREATE TYPE tipo_evidencia_enum AS ENUM (
    'foto',              -- Fotografía
    'video',             -- Video
    'audio',             -- Grabación de audio
    'documento',         -- Documento (PDF, etc)
    'firma',             -- Firma del cliente
    'certificado',       -- Certificado de temperatura
    'otro'               -- Otro tipo de evidencia
);
CREATE TYPE tipo_archivo_enum AS ENUM ('jpg', 'png', 'pdf', 'mp4', 'mp3');
CREATE TYPE estado_entrega_enum AS ENUM (
    'pendiente',           -- Cuando se crea la entrega
    'en_ruta',            -- Cuando el vehículo está en camino
    'en_destino',         -- Cuando llegó al punto de entrega
    'completada',         -- Entrega exitosa
    'fallida',            -- No se pudo entregar
    'con_reclamo',        -- Hay un reclamo asociado
    'reprogramada',       -- Se reprogramó la entrega
    'cancelada'           -- Se canceló la entrega
);
CREATE TYPE estado_solucion_enum AS ENUM (
    'propuesta',          -- Solución propuesta
    'en_proceso',         -- Se está implementando
    'implementada',       -- Se implementó
    'rechazada',          -- No se aceptó
    'cancelada'           -- Se canceló
);
CREATE TYPE estado_recorrido_enum AS ENUM (
    'en_ruta',
    'completada',
    'cancelada'
);

-- Creación de las tablas

-- Tablas ya existentes
CREATE TABLE Cliente (
    id_cliente UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    tipo_cliente tipo_cliente NOT NULL,
    RUC VARCHAR(11) CHECK (RUC ~ '^[0-9]{11}$'),
    DNI CHAR(8) CHECK (DNI ~ '^[0-9]{8}$'),
    direccion VARCHAR(100) NOT NULL,
    distrito VARCHAR(30) NOT NULL,
    provincia VARCHAR(30) NOT NULL,
    departamento VARCHAR(30) NOT NULL,
    telefono VARCHAR(9) NOT NULL CHECK (telefono ~ '^[0-9]{9}$'),
    telefono_alternativo VARCHAR(9) NOT NULL CHECK (telefono_alternativo ~ '^[0-9]{9}$'),
    email VARCHAR(80),
    tipo_negocio tipo_negocio,
    horario_atencion VARCHAR(50),
    fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    genero genero NOT NULL
);

CREATE TABLE Usuario (
    id_usuario UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    rol rol_usuario NOT NULL DEFAULT 'operador',
    contrasena VARCHAR(150) NOT NULL,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Vehiculo (
    id_vehiculo UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    placa VARCHAR(7) NOT NULL UNIQUE,
    marca VARCHAR(15) NOT NULL,
    modelo VARCHAR(15) NOT NULL,
    año SMALLINT NOT NULL CHECK (año BETWEEN 2000 AND EXTRACT(YEAR FROM CURRENT_DATE)),
    color VARCHAR(15) NOT NULL,
    tipo_vehiculo tipo_vehiculo NOT NULL,
    capacidad_carga DECIMAL(7,2) NOT NULL CHECK (capacidad_carga > 0),
    capacidad_combustible DECIMAL(6,2) NOT NULL CHECK (capacidad_combustible > 0),
    estado_vehiculo BOOLEAN DEFAULT TRUE,
    numero_soat VARCHAR(7) NOT NULL UNIQUE,
    fecha_vencimiento_soat DATE NOT NULL,
    fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    gps_imei VARCHAR(30) NOT NULL UNIQUE,
    gps_estado BOOLEAN DEFAULT TRUE,
    foto_vehiculo VARCHAR(255),
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario)
);

CREATE TABLE Conductor (
    id_conductor UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    DNI CHAR(8) NOT NULL UNIQUE CHECK (DNI ~ '^[0-9]{8}$'),
    nombre_conductor VARCHAR(60) NOT NULL,
    telefono_conductor VARCHAR(9)  NOT NULL CHECK (telefono_conductor ~ '^[0-9]{9}$'),
    email_conductor VARCHAR(80) NOT NULL,
    direccion_conductor VARCHAR(120),
    estado_conductor BOOLEAN DEFAULT TRUE,
    tipo_licencia tipo_licencia NOT NULL,
    fecha_emision_licencia DATE NOT NULL,
    fecha_vencimiento_licencia DATE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    genero genero NOT NULL,
    foto_conductor VARCHAR(255),
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario)
);

-- modulo 1

CREATE TABLE Orden_entrega (
    id_orden_entrega UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    destino VARCHAR(100) NOT NULL,
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario),
    coordenada_destino POINT NOT NULL,
    fecha_orden TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(400) NOT NULL,
    id_cliente UUID NOT NULL REFERENCES Cliente(id_cliente),
    nivel_prioridad nivel_prioridad NOT NULL,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Producto (
    id_producto UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    peso_total DECIMAL(8, 2) NOT NULL CHECK (peso_total > 0),
    volumen_total DECIMAL(8, 2) NOT NULL CHECK (volumen_total > 0),
    tipo_producto tipo_producto NOT NULL,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Detalle_Orden (
    id_detalle_orden UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_producto UUID NOT NULL REFERENCES Producto(id_producto),
    id_orden_entrega UUID NOT NULL REFERENCES Orden_entrega(id_orden_entrega),
    cantidad SMALLINT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(8,2) NOT NULL, 
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_producto, id_orden_entrega)
);

-- modulo 2

CREATE TABLE Carga (
    id_carga UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario),
    tipo_conservacion tipo_conservacion NOT NULL,
    rango_inicial_temperatura_requerida DECIMAL(4,1),
    rango_final_temperatura_requerida DECIMAL(4,1),
    ubicacion_origen hub NOT NULL,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    observaciones VARCHAR(400)
);

CREATE TABLE Detalle_carga (
    id_detalle_carga UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_carga UUID NOT NULL REFERENCES Carga(id_carga) ON DELETE CASCADE,
    id_detalle_orden UUID NOT NULL REFERENCES Detalle_Orden(id_detalle_orden) ON DELETE CASCADE,
    peso DECIMAL(8,2) NOT NULL CHECK (peso > 0),
    observaciones VARCHAR(400),
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Punto_entrega (
    id_punto_entrega UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre_punto VARCHAR(150) NOT NULL,
    tipo_punto tipo_punto NOT NULL,
    coordenada_punto POINT NOT NULL,
    zona VARCHAR(50) NOT NULL,
    horario_atencion VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Tramo_ruta (
    id_tramo_ruta UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_origen UUID NOT NULL REFERENCES Punto_entrega(id_punto_entrega),
    id_destino UUID NOT NULL REFERENCES Punto_entrega(id_punto_entrega),
    nombre_ruta VARCHAR(150) NOT NULL,
    recorrido_km DECIMAL(8,2) NOT NULL CHECK (recorrido_km > 0),
    distancia_km DECIMAL(8,2) NOT NULL CHECK (distancia_km > 0),
    tiempo_estimado INTERVAL NOT NULL,
    ruta_planificada POINT[] NOT NULL,
    estado_ruta BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_distancias CHECK (recorrido_km >= distancia_km),
    CONSTRAINT check_origen_destino CHECK (id_origen != id_destino)
);

CREATE TABLE Plan_entrega (
    id_plan_entrega UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tiempo_total_estimado INTERVAL NOT NULL,
    recorrido_total_km DECIMAL(8,2) NOT NULL CHECK (recorrido_total_km > 0),
    distancia_total_km DECIMAL(8,2) NOT NULL CHECK (distancia_total_km > 0),
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario),
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Detalle_plan_entrega (
    id_detalle_plan_entrega UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_plan_entrega UUID NOT NULL REFERENCES Plan_entrega(id_plan_entrega),
    id_tramo_ruta UUID NOT NULL REFERENCES Tramo_ruta(id_tramo_ruta),
    id_detalle_carga UUID NOT NULL REFERENCES Detalle_carga(id_detalle_carga),
    orden_parada SMALLINT NOT NULL CHECK (orden_parada > 0),
    tiempo_estimado_parada INTERVAL NOT NULL,
    tiempo_descarga_estimado INTERVAL NOT NULL,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_plan_entrega, orden_parada)
);

-- modulo 3

-- Veihulo y Conductor (encargado de crear, modificar y eliminar) tambien pertenecen a este modulo

CREATE TABLE Asignacion_transporte (
    id_asignacion_transporte UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_vehiculo UUID NOT NULL REFERENCES Vehiculo(id_vehiculo),
    id_conductor UUID NOT NULL REFERENCES Conductor(id_conductor),
    id_plan_entrega UUID NOT NULL REFERENCES Plan_entrega(id_plan_entrega),
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario),
    estado_asignacion estado_asignacion NOT NULL DEFAULT 'pendiente',
    fecha_inicio_estimada TIMESTAMPTZ,
    fecha_fin_estimada TIMESTAMPTZ,
    observaciones VARCHAR(400),
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_fechas CHECK (fecha_inicio_estimada < fecha_fin_estimada)
);

-- modulo 4

CREATE TABLE Catalogo_condicion (
    id_catalogo_condicion UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre_condicion VARCHAR(80) NOT NULL,
    tipo_condicion tipo_condicion_enum NOT NULL,
    descripcion VARCHAR(400) NOT NULL
);

CREATE TABLE Condicion_despacho (
    id_condicion_despacho UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_asignacion_transporte UUID NOT NULL REFERENCES Asignacion_transporte(id_asignacion_transporte) ON DELETE CASCADE,
    id_catalogo_condicion UUID NOT NULL REFERENCES Catalogo_condicion(id_catalogo_condicion),
    resultadoxcondicion BOOLEAN NOT NULL,
    fecha_revision TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario)
);

CREATE TABLE Resultado_condicion_despacho (
    id_resultado_condicion_despacho UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resultado_autorizacion BOOLEAN NOT NULL,
    observaciones VARCHAR(400),
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario),
    fecha_autorizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Detalle_resultado_condicion (
    id_resultado_condicion_despacho UUID NOT NULL REFERENCES Resultado_condicion_despacho(id_resultado_condicion_despacho) ON DELETE CASCADE,
    id_condicion_despacho UUID NOT NULL REFERENCES Condicion_despacho(id_condicion_despacho) ON DELETE CASCADE,
    PRIMARY KEY (id_resultado_condicion_despacho, id_condicion_despacho)
);

CREATE TABLE Rechazo_Despacho (
    id_rechazo_despacho UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_resultado_condicion_despacho UUID NOT NULL REFERENCES Resultado_condicion_despacho(id_resultado_condicion_despacho) ON DELETE CASCADE,
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario),
    fecha_rechazo TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    motivo_rechazo VARCHAR(200) NOT NULL,
    tipo_accion tipo_accion_enum NOT NULL,
    estado_accion estado_accion_enum NOT NULL DEFAULT 'pendiente'
);

CREATE TABLE Despacho (
    id_despacho UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_resultado_condicion_despacho UUID NOT NULL UNIQUE REFERENCES Resultado_condicion_despacho(id_resultado_condicion_despacho) ON DELETE CASCADE,
    fecha_despacho TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    estado_recorrido estado_recorrido_enum DEFAULT 'en_ruta',
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario),
    observaciones VARCHAR(400)
);

-- modulo 5
CREATE TABLE Monitoreo_ruta (
    id_monitoreo_ruta UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_despacho UUID NOT NULL REFERENCES Despacho(id_despacho),
    ubicacion_actual POINT NOT NULL,
    velocidad DECIMAL(5,2) NOT NULL CHECK (velocidad >= 0),
    temperatura_carga DECIMAL(4,1),
    combustible_restante DECIMAL(5,2) CHECK (combustible_restante >= 0),
    estado_compartimento estado_compartimento NOT NULL,
    timestamp_registro TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    distancia_recorrida DECIMAL(8,2) NOT NULL DEFAULT 0,
    tiempo_transcurrido INTERVAL NOT NULL DEFAULT '00:00:00'
);

CREATE TABLE Incidencia (
    id_incidencia UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_monitoreo_ruta UUID NOT NULL REFERENCES Monitoreo_ruta(id_monitoreo_ruta),
    tipo_incidencia tipo_incidencia NOT NULL,
    severidad severidad NOT NULL,
    descripcion VARCHAR(400) NOT NULL,
    estado_incidencia estado_incidencia NOT NULL DEFAULT 'pendiente',
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario), 
    fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Solucion_incidencia (
    id_solucion_incidencia UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_incidencia UUID NOT NULL REFERENCES Incidencia(id_incidencia) ON DELETE CASCADE,
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario),
    descripcion_solucion VARCHAR(400) NOT NULL,
    fecha_solucion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    costo_solucion DECIMAL(8,2),
    tiempo_resolucion INTERVAL,
    observaciones VARCHAR(200)
);


-- modulo 6

CREATE TABLE Entrega (
    id_entrega UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_despacho UUID NOT NULL REFERENCES Despacho(id_despacho),
    id_usuario UUID NOT NULL REFERENCES Usuario(id_usuario),
    fecha_entrega TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_entrega estado_entrega_enum NOT NULL DEFAULT 'pendiente',
    firma_cliente VARCHAR(255),
    evidencia VARCHAR(255),
    observaciones VARCHAR(200),
    punto_entrega UUID NOT NULL REFERENCES Punto_entrega(id_punto_entrega),
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Detalle_entrega (
    id_detalle_entrega UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_entrega UUID NOT NULL REFERENCES Entrega(id_entrega) ON DELETE CASCADE,
    id_detalle_carga UUID NOT NULL REFERENCES Detalle_carga(id_detalle_carga),
    cantidad_entregada SMALLINT NOT NULL CHECK (cantidad_entregada > 0),
    cantidad_rechazada SMALLINT DEFAULT 0 CHECK (cantidad_rechazada >= 0),
    motivo_rechazo VARCHAR(200),
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_entrega, id_detalle_carga)
);

-- modulo 7

CREATE TABLE Reclamo (
    id_reclamo UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_detalle_entrega UUID REFERENCES Detalle_entrega(id_detalle_entrega),
    id_usuario_registro UUID REFERENCES Usuario(id_usuario),
    descripcion VARCHAR(500) NOT NULL,
    fecha_reclamo TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    estado estado_reclamo_enum NOT NULL DEFAULT 'pendiente',
    tipo_reclamo tipo_reclamo_enum,
    severidad severidad,
    observaciones VARCHAR(200)
);

CREATE TABLE Solucion_reclamo (
    id_solucion_reclamo UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_reclamo UUID NOT NULL REFERENCES Reclamo(id_reclamo) ON DELETE CASCADE,
    id_usuario_propuesta UUID NOT NULL REFERENCES Usuario(id_usuario),
    descripcion_solucion VARCHAR(400) NOT NULL,
    estado estado_solucion_enum NOT NULL DEFAULT 'propuesta',
    costo_estimado DECIMAL(8,2),
    fecha_propuesta TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMPTZ,
    observaciones VARCHAR(200)
);

CREATE TABLE Evidencia (
    id_evidencia UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_reclamo UUID REFERENCES Reclamo(id_reclamo) ON DELETE CASCADE,
    tipo_evidencia tipo_evidencia_enum NOT NULL,
    tipo_archivo tipo_archivo_enum NOT NULL,
    url_archivo VARCHAR(100) NOT NULL,
    fecha_subida TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    id_usuario_subida UUID NOT NULL REFERENCES Usuario(id_usuario),
    descripcion VARCHAR(200)
);