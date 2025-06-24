-- Modulo 5
-- Para mi modulo
-- Monitoreo_ruta
CREATE INDEX IF NOT EXISTS idx_monitoreo_ruta_id_despacho ON Monitoreo_ruta(id_despacho);
CREATE INDEX IF NOT EXISTS idx_monitoreo_ruta_id_despacho_timestamp ON Monitoreo_ruta(id_despacho, timestamp_registro DESC);

-- Incidencia
-- Usado en WHERE de funciones y vistas
CREATE INDEX IF NOT EXISTS idx_incidencia_id_monitoreo_ruta ON Incidencia(id_monitoreo_ruta);
CREATE INDEX IF NOT EXISTS idx_incidencia_id_incidencia_fecha_registro_desc ON Incidencia(id_incidencia, fecha_registro DESC);
CREATE INDEX IF NOT EXISTS idx_incidencia_fecha_desc ON Incidencia(fecha_registro DESC);
CREATE INDEX IF NOT EXISTS idx_incidencia_id_usuario ON Incidencia(id_usuario);

-- Solucion_incidencia
CREATE INDEX IF NOT EXISTS idx_solucion_incidencia_fecha_solucion_desc ON Solucion_incidencia(fecha_solucion DESC);


-- Necesarios de otros modulos
-- Despacho
CREATE INDEX IF NOT EXISTS idx_despacho_id_resultado_condicion_despacho ON Despacho(id_resultado_condicion_despacho);

-- Detalle_resultado_condicion
CREATE INDEX IF NOT EXISTS idx_detalle_resultado_condicion_id_condicion_despacho ON Detalle_resultado_condicion(id_condicion_despacho);

-- Condicion_despacho
CREATE INDEX IF NOT EXISTS idx_condicion_id_asignacion_transporte ON Condicion_despacho(id_asignacion_transporte);

-- Asignacion_transporte
CREATE INDEX IF NOT EXISTS idx_asignacion_id_vehiculo ON Asignacion_transporte(id_vehiculo);
CREATE INDEX IF NOT EXISTS idx_asignacion_id_conductor ON Asignacion_transporte(id_conductor);
CREATE INDEX IF NOT EXISTS idx_asignacion_id_plan_entrega ON Asignacion_transporte(id_plan_entrega);

-- Detalle_plan_entrega
CREATE INDEX IF NOT EXISTS idx_detalle_plan_entrega_id_plan_entrega ON Detalle_plan_entrega(id_plan_entrega);
CREATE INDEX IF NOT EXISTS idx_detalle_plan_entrega_id_tramo_ruta ON Detalle_plan_entrega(id_tramo_ruta);
CREATE INDEX IF NOT EXISTS idx_detalle_plan_entrega_id_detalle_carga ON Detalle_plan_entrega(id_detalle_carga);

-- Detalle_carga
CREATE INDEX IF NOT EXISTS idx_detalle_carga_id_carga ON Detalle_carga(id_carga);

-- Punto_entrega
CREATE INDEX IF NOT EXISTS idx_punto_entrega_gist_coordenada_punto ON Punto_entrega USING GIST (coordenada_punto);

-- Tramo_ruta
CREATE INDEX IF NOT EXISTS idx_tramo_ruta_id_destino ON Tramo_ruta(id_destino);
CREATE INDEX IF NOT EXISTS idx_tramo_ruta_id_origen ON Tramo_ruta(id_origen);
