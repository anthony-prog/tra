-- Modulo 5
-- Drop functions
DROP FUNCTION IF EXISTS fn_incidencias_relacionadas(uuid);
DROP FUNCTION IF EXISTS fn_detalle_incidencia(uuid);
DROP FUNCTION IF EXISTS fn_puntos_visitados_despacho(uuid);
DROP FUNCTION IF EXISTS fn_puntos_ruta_despacho(uuid);
DROP FUNCTION IF EXISTS fn_datos_despacho(uuid);

-- Historial de incidencias
CREATE OR REPLACE FUNCTION fn_incidencias_relacionadas(p_id_incidencia UUID)
RETURNS TABLE (
    id_incidencia UUID,
    fecha_registro TIMESTAMPTZ,
    tipo_incidencia tipo_incidencia,
    descripcion VARCHAR(400),
    tipo_relacion TEXT,
    tiempo_transcurrido INTERVAL
) AS $$
BEGIN
    RETURN QUERY
    WITH incidencia_actual AS (
        SELECT
            i.id_incidencia,
            c.id_conductor,
            v.id_vehiculo,
            mr.ubicacion_actual
        FROM
            Incidencia i
        JOIN Monitoreo_ruta mr ON i.id_monitoreo_ruta = mr.id_monitoreo_ruta
        JOIN Despacho d ON mr.id_despacho = d.id_despacho
        JOIN
            Resultado_condicion_despacho rcd ON d.id_resultado_condicion_despacho = rcd.id_resultado_condicion_despacho
        JOIN
            Detalle_resultado_condicion drc ON rcd.id_resultado_condicion_despacho = drc.id_resultado_condicion_despacho
        JOIN
            Condicion_despacho cd ON drc.id_condicion_despacho = cd.id_condicion_despacho
        JOIN
            Asignacion_transporte at ON cd.id_asignacion_transporte = at.id_asignacion_transporte
        JOIN Vehiculo v ON at.id_vehiculo = v.id_vehiculo
        JOIN Conductor c ON at.id_conductor = c.id_conductor
        WHERE i.id_incidencia = p_id_incidencia
    )
    SELECT DISTINCT
        i.id_incidencia,
        i.fecha_registro,
        i.tipo_incidencia,
        i.descripcion,
        -- Relación encontrada
        CASE
            WHEN c.id_conductor = ia.id_conductor THEN 'Mismo conductor'
            WHEN v.id_vehiculo = ia.id_vehiculo THEN 'Mismo vehículo'
            WHEN abs(mr.ubicacion_actual[0] - ia.ubicacion_actual[0]) < 0.001
                AND abs(mr.ubicacion_actual[1] - ia.ubicacion_actual[1]) < 0.001 THEN 'Misma ubicación'
            ELSE 'Otro'
        END AS tipo_relacion,
        -- Tiempo transcurrido
        now() - i.fecha_registro AS tiempo_transcurrido
    FROM
        Incidencia i
    JOIN Monitoreo_ruta mr ON i.id_monitoreo_ruta = mr.id_monitoreo_ruta
    JOIN Despacho d ON mr.id_despacho = d.id_despacho
    JOIN
        Resultado_condicion_despacho rcd ON d.id_resultado_condicion_despacho = rcd.id_resultado_condicion_despacho
    JOIN
        Detalle_resultado_condicion drc ON rcd.id_resultado_condicion_despacho = drc.id_resultado_condicion_despacho
    JOIN
        Condicion_despacho cd ON drc.id_condicion_despacho = cd.id_condicion_despacho
    JOIN
        Asignacion_transporte at ON cd.id_asignacion_transporte = at.id_asignacion_transporte
    JOIN Vehiculo v ON at.id_vehiculo = v.id_vehiculo
    JOIN Conductor c ON at.id_conductor = c.id_conductor
    CROSS JOIN incidencia_actual ia
    WHERE
        i.id_incidencia <> ia.id_incidencia
        AND (
            c.id_conductor = ia.id_conductor
            OR v.id_vehiculo = ia.id_vehiculo
            OR (
                abs(mr.ubicacion_actual[0] - ia.ubicacion_actual[0]) < 0.001
                AND abs(mr.ubicacion_actual[1] - ia.ubicacion_actual[1]) < 0.001
            )
        )
    ORDER BY
        i.fecha_registro DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Obtener detalle de una Incidencia
CREATE OR REPLACE FUNCTION fn_detalle_incidencia(p_id_incidencia UUID)
RETURNS TABLE (
    fecha_registro TIMESTAMPTZ,
    tipo_incidencia tipo_incidencia,
    severidad severidad,
    descripcion VARCHAR(400),
    estado_incidencia estado_incidencia,
    nombre_usuario VARCHAR(100),
    ubicacion_actual TEXT,
    velocidad DECIMAL(5,2),
    temperatura_carga DECIMAL(4,1),
    combustible_restante DECIMAL(5,2),
    estado_compartimento estado_compartimento,
    distancia_recorrida DECIMAL(8,2),
    tiempo_transcurrido INTERVAL,
    placa VARCHAR(7),
    modelo VARCHAR(15),
    nombre_conductor VARCHAR(60),
    telefono_conductor VARCHAR(9)
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        i.fecha_registro,
        i.tipo_incidencia,
        i.severidad,
        i.descripcion,
        i.estado_incidencia,
        u.nombre_usuario,
        mr.ubicacion_actual::text AS ubicacion_actual,
        mr.velocidad,
        mr.temperatura_carga,
        mr.combustible_restante,
        mr.estado_compartimento,
        mr.distancia_recorrida,
        mr.tiempo_transcurrido,
        v.placa,
        v.modelo,
        c.nombre_conductor,
        c.telefono_conductor
    FROM
        Incidencia i
    JOIN
        Monitoreo_ruta mr ON i.id_monitoreo_ruta = mr.id_monitoreo_ruta
    JOIN
        Usuario u ON i.id_usuario = u.id_usuario
    JOIN
        Despacho d ON mr.id_despacho = d.id_despacho
    JOIN
        Resultado_condicion_despacho rcd ON d.id_resultado_condicion_despacho = rcd.id_resultado_condicion_despacho
    JOIN
        Detalle_resultado_condicion drc ON rcd.id_resultado_condicion_despacho = drc.id_resultado_condicion_despacho
    JOIN
        Condicion_despacho cd ON drc.id_condicion_despacho = cd.id_condicion_despacho
    JOIN
        Asignacion_transporte at ON cd.id_asignacion_transporte = at.id_asignacion_transporte
    JOIN
        Vehiculo v ON at.id_vehiculo = v.id_vehiculo
    JOIN
        Conductor c ON at.id_conductor = c.id_conductor
    WHERE
        i.id_incidencia = p_id_incidencia;
END;
$$ LANGUAGE plpgsql;


-- Puntos visitados de un despacho
CREATE OR REPLACE FUNCTION fn_puntos_visitados_despacho(p_id_despacho UUID)
RETURNS TABLE (
    orden_parada SMALLINT,
    nombre_punto VARCHAR(150),
    coordenada_punto TEXT,
    visitado BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        dpe.orden_parada,
        pd.nombre_punto,
        pd.coordenada_punto::text AS coordenada_punto,
        EXISTS (
            SELECT 1
            FROM Monitoreo_ruta mr
            WHERE mr.id_despacho = d.id_despacho
            AND point(mr.ubicacion_actual[0], mr.ubicacion_actual[1]) <@ circle(pd.coordenada_punto, 0.001) -- 0.001 aprox 100m
        ) AS visitado
    FROM
        Despacho d
    JOIN
        Resultado_condicion_despacho rcd ON d.id_resultado_condicion_despacho = rcd.id_resultado_condicion_despacho
    JOIN
        Detalle_resultado_condicion drc ON rcd.id_resultado_condicion_despacho = drc.id_resultado_condicion_despacho
    JOIN
        Condicion_despacho cd ON drc.id_condicion_despacho = cd.id_condicion_despacho
    JOIN
        Asignacion_transporte at ON cd.id_asignacion_transporte = at.id_asignacion_transporte
    JOIN
        Plan_entrega pe ON at.id_plan_entrega = pe.id_plan_entrega
    JOIN
        Detalle_plan_entrega dpe ON pe.id_plan_entrega = dpe.id_plan_entrega
    JOIN
        Tramo_ruta tr ON dpe.id_tramo_ruta = tr.id_tramo_ruta
    JOIN
        Punto_entrega pd ON tr.id_destino = pd.id_punto_entrega
    WHERE
        d.id_despacho = p_id_despacho
    ORDER BY
        dpe.orden_parada;
END;
$$ LANGUAGE plpgsql;

-- Obtener los puntos de la ruta de un despacho
CREATE OR REPLACE FUNCTION fn_puntos_ruta_despacho(p_id_despacho UUID)
RETURNS TABLE (
    orden_parada SMALLINT,
    nombre_origen VARCHAR(150),
    coordenada_origen TEXT,
    nombre_destino VARCHAR(150),
    coordenada_destino TEXT,
    nombre_ruta VARCHAR(150),
    recorrido_km DECIMAL(8,2),
    distancia_km DECIMAL(8,2),
    tiempo_estimado INTERVAL,
    ruta_planificada TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        dpe.orden_parada,
        po.nombre_punto AS nombre_origen,
        po.coordenada_punto::text AS coordenada_origen,
        pd.nombre_punto AS nombre_destino,
        pd.coordenada_punto::text AS coordenada_destino,
        tr.nombre_ruta,
        tr.recorrido_km,
        tr.distancia_km,
        tr.tiempo_estimado,
        tr.ruta_planificada::text AS ruta_planificada
    FROM
        Despacho d
    JOIN
        Resultado_condicion_despacho rcd ON d.id_resultado_condicion_despacho = rcd.id_resultado_condicion_despacho
    JOIN
        Detalle_resultado_condicion drc ON rcd.id_resultado_condicion_despacho = drc.id_resultado_condicion_despacho
    JOIN
        Condicion_despacho cd ON drc.id_condicion_despacho = cd.id_condicion_despacho
    JOIN
        Asignacion_transporte at ON cd.id_asignacion_transporte = at.id_asignacion_transporte
    JOIN
        Plan_entrega pe ON at.id_plan_entrega = pe.id_plan_entrega
    JOIN
        Detalle_plan_entrega dpe ON pe.id_plan_entrega = dpe.id_plan_entrega
    JOIN
        Tramo_ruta tr ON dpe.id_tramo_ruta = tr.id_tramo_ruta
    JOIN
        Punto_entrega po ON tr.id_origen = po.id_punto_entrega
    JOIN
        Punto_entrega pd ON tr.id_destino = pd.id_punto_entrega
    WHERE
        d.id_despacho = p_id_despacho
    ORDER BY
        dpe.orden_parada;
END;
$$ LANGUAGE plpgsql;

-- Obtener datos de un despacho
CREATE OR REPLACE FUNCTION fn_datos_despacho(p_id_despacho UUID)
RETURNS TABLE (
    fecha_despacho TIMESTAMPTZ,
    estado_recorrido estado_recorrido_enum,
    id_vehiculo UUID,
    modelo VARCHAR(15),
    marca VARCHAR(15),
    placa VARCHAR(7),
    color VARCHAR(15),
    año SMALLINT,
    estado_vehiculo BOOLEAN,
    foto_vehiculo VARCHAR(255),
    capacidad_carga DECIMAL(7,2),
    capacidad_combustible DECIMAL(6,2),
    gps_imei VARCHAR(30),
    gps_estado BOOLEAN,
    fecha_vencimiento_soat DATE,
    numero_soat VARCHAR(7),
    id_conductor UUID,
    DNI CHAR(8),
    nombre_conductor VARCHAR(60),
    telefono_conductor VARCHAR(9),
    foto_conductor VARCHAR(255),
    email_conductor VARCHAR(80),
    fecha_nacimiento DATE,
    direccion_conductor VARCHAR(120),
    tipo_licencia tipo_licencia,
    fecha_vencimiento_licencia DATE,
    fecha_emision_licencia DATE,
    estado_conductor BOOLEAN,
    id_carga UUID,
    tipo_conservacion tipo_conservacion,
    rango_inicial_temperatura_requerida DECIMAL(4,1),
    rango_final_temperatura_requerida DECIMAL(4,1),
    peso_total DECIMAL(8,2),
    distancia_total_km DECIMAL(8,2),
    recorrido_total_km DECIMAL(8,2),
    tiempo_total_estimado INTERVAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.fecha_despacho,
        d.estado_recorrido,

        -- Vehículo
        v.id_vehiculo,
        v.modelo,
        v.marca,
        v.placa,
        v.color,
        v.año,
        v.estado_vehiculo,
        v.foto_vehiculo,
        v.capacidad_carga,
        v.capacidad_combustible,
        v.gps_imei,
        v.gps_estado,
        v.fecha_vencimiento_soat,
        v.numero_soat,

        -- Conductor
        c.id_conductor,
        c.DNI,
        c.nombre_conductor,
        c.telefono_conductor,
        c.foto_conductor,
        c.email_conductor,
        c.fecha_nacimiento,
        c.direccion_conductor,
        c.tipo_licencia,
        c.fecha_vencimiento_licencia,
        c.fecha_emision_licencia,
        c.estado_conductor,

        -- Carga
        ca.id_carga,
        ca.tipo_conservacion,
        ca.rango_inicial_temperatura_requerida,
        ca.rango_final_temperatura_requerida,
        SUM(dc.peso) AS peso_total,

        -- Plan de entrega
        pe.distancia_total_km,
        pe.recorrido_total_km,
        pe.tiempo_total_estimado

    FROM
        Despacho d
    JOIN
        Resultado_condicion_despacho rcd ON d.id_resultado_condicion_despacho = rcd.id_resultado_condicion_despacho
    JOIN
        Detalle_resultado_condicion drc ON rcd.id_resultado_condicion_despacho = drc.id_resultado_condicion_despacho
    JOIN
        Condicion_despacho cd ON drc.id_condicion_despacho = cd.id_condicion_despacho
    JOIN
        Asignacion_transporte at ON cd.id_asignacion_transporte = at.id_asignacion_transporte
    JOIN
        Vehiculo v ON at.id_vehiculo = v.id_vehiculo
    JOIN
        Conductor c ON at.id_conductor = c.id_conductor
    JOIN
        Plan_entrega pe ON at.id_plan_entrega = pe.id_plan_entrega
    JOIN
        Detalle_plan_entrega dpe ON pe.id_plan_entrega = dpe.id_plan_entrega
    JOIN
        Detalle_carga dc ON dpe.id_detalle_carga = dc.id_detalle_carga
    JOIN
        Carga ca ON dc.id_carga = ca.id_carga
    WHERE
        d.id_despacho = p_id_despacho
    GROUP BY
        d.id_despacho, d.fecha_despacho, d.estado_recorrido,
        v.id_vehiculo, v.modelo, v.marca, v.placa, v.color, v.año, v.estado_vehiculo, v.foto_vehiculo, v.capacidad_carga, v.capacidad_combustible, v.gps_imei, v.gps_estado, v.fecha_vencimiento_soat, v.numero_soat,
        c.id_conductor, c.DNI, c.nombre_conductor, c.telefono_conductor, c.foto_conductor, c.email_conductor, c.fecha_nacimiento, c.direccion_conductor, c.tipo_licencia, c.fecha_vencimiento_licencia, c.fecha_emision_licencia, c.estado_conductor,
        ca.id_carga, ca.tipo_conservacion, ca.rango_inicial_temperatura_requerida, ca.rango_final_temperatura_requerida,
        pe.distancia_total_km, pe.recorrido_total_km, pe.tiempo_total_estimado;
END;
$$ LANGUAGE plpgsql;