--Modulo 4
-- Muestra un resumen del estado de evaluación de cada asignación
CREATE OR REPLACE VIEW vista_resultado_asignaciones AS
SELECT
  at.id_asignacion_transporte,
  v.placa,
  c.nombre_conductor,
  COUNT(DISTINCT cd.id_catalogo_condicion) AS condiciones_evaluadas,
  SUM(CASE WHEN cd.resultadoxcondicion THEN 1 ELSE 0 END) AS condiciones_true,
  cc.total_condiciones,
  rcd.resultado_autorizacion
FROM asignacion_transporte at
JOIN vehiculo v ON v.id_vehiculo = at.id_vehiculo
JOIN conductor c ON c.id_conductor = at.id_conductor
JOIN condicion_despacho cd ON cd.id_asignacion_transporte = at.id_asignacion_transporte
JOIN detalle_resultado_condicion drc ON drc.id_condicion_despacho = cd.id_condicion_despacho
JOIN resultado_condicion_despacho rcd ON rcd.id_resultado_condicion_despacho = drc.id_resultado_condicion_despacho
-- Subconsulta para contar total de condiciones posibles
CROSS JOIN (
  SELECT COUNT(*) AS total_condiciones FROM catalogo_condicion
) cc
GROUP BY
  at.id_asignacion_transporte,
  v.placa,
  c.nombre_conductor,
  rcd.resultado_autorizacion,
  cc.total_condiciones
ORDER BY
  at.id_asignacion_transporte;

-- Modulo 5
-- Mostrar todas las incidencias
CREATE OR REPLACE VIEW vista_incidencias AS
SELECT DISTINCT ON (i.id_incidencia)
    i.id_incidencia AS id_incidencia,
    i.fecha_registro AS fecha_registro,
    i.tipo_incidencia AS tipo_incidencia,
    i.severidad AS severidad,
    i.descripcion AS descripcion,
    i.estado_incidencia AS estado_incidencia,
    i.id_monitoreo_ruta AS id_monitoreo_ruta,
    u.nombre_usuario AS nombre_usuario,

    v.placa AS placa_vehiculo,
    v.modelo AS modelo,
    v.marca AS marca,

    c.nombre_conductor AS nombre_conductor,
    c.telefono_conductor AS telefono_conductor,

    mr.ubicacion_actual AS ubicacion_actual,
    mr.timestamp_registro AS timestamp_registro
FROM
    Incidencia i
JOIN
    Monitoreo_ruta mr ON i.id_monitoreo_ruta = mr.id_monitoreo_ruta
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
    Conductor c ON at.id_conductor = c.id_conductor
JOIN
    Vehiculo v ON at.id_vehiculo = v.id_vehiculo
JOIN
    Usuario u ON i.id_usuario = u.id_usuario
ORDER BY
    i.id_incidencia, i.fecha_registro DESC;


-- Obtener todos los despachos
CREATE OR REPLACE VIEW vista_despachos_estado AS
SELECT DISTINCT
    d.id_despacho AS id_despacho,
    d.fecha_despacho AS fecha_despacho,
    d.estado_recorrido AS estado_recorrido,
    pe.tiempo_total_estimado AS tiempo_total_estimado,
    pd.nombre_punto AS nombre_destino,
    tr.nombre_ruta AS nombre_ruta,
    dpe.orden_parada AS orden_parada,
    tp.total_paradas,
    v.placa AS placa_vehiculo,
    v.tipo_vehiculo AS tipo_vehiculo,
    v.modelo AS modelo,
    c.nombre_conductor AS nombre_conductor,
    c.telefono_conductor AS telefono_conductor,
    ca.tipo_conservacion AS tipo_conservacion,
    ca.ubicacion_origen AS ubicacion_origen,
    SUM(dc.peso) OVER (PARTITION BY d.id_despacho) AS peso_total
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
    Vehiculo v ON at.id_vehiculo = v.id_vehiculo
JOIN
    Conductor c ON at.id_conductor = c.id_conductor
JOIN
    Detalle_carga dc ON dpe.id_detalle_carga = dc.id_detalle_carga
JOIN
    Carga ca ON dc.id_carga = ca.id_carga
JOIN
    Tramo_ruta tr ON dpe.id_tramo_ruta = tr.id_tramo_ruta
JOIN
    Punto_entrega pd ON tr.id_destino = pd.id_punto_entrega
JOIN (
    SELECT 
        d.id_despacho,
        COUNT(DISTINCT dpe.orden_parada) AS total_paradas
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
    GROUP BY
        d.id_despacho
) tp ON d.id_despacho = tp.id_despacho
ORDER BY
    d.id_despacho, dpe.orden_parada;