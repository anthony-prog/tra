"use client";

import { useState } from "react";
import { GestionDespachoService } from "@/api/generated";
import type { CreateRechazoDespachoDto } from "@/api/generated";
import { TipoAccion } from "../../../../constants/accionEnums";
import { EstadoAccion } from "../../../../constants/accionEnums";


export default function RechazoForm() {
  const [formData, setFormData] = useState<CreateRechazoDespachoDto>({
    id_resultado_condicion_despacho: "",
    id_usuario: "",
    motivo_rechazo: "",
    tipo_accion: TipoAccion.REPROGRAMAR as unknown as CreateRechazoDespachoDto.tipo_accion,
    estado_accion: EstadoAccion.PENDIENTE as unknown as CreateRechazoDespachoDto.estado_accion,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await GestionDespachoService.gestionDespachoControllerRegistrarRechazoDespacho(formData);
      alert("Rechazo registrado exitosamente");
    } catch (error) {
      alert("Error al registrar rechazo");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="id_resultado_condicion_despacho" placeholder="ID Resultado Condición" onChange={handleChange} className="border p-2 w-full" required />
      <input name="id_usuario" placeholder="ID Usuario" onChange={handleChange} className="border p-2 w-full" required />
      <textarea name="motivo_rechazo" placeholder="Motivo del rechazo" onChange={handleChange} className="border p-2 w-full" required />
      <select name="tipo_accion" onChange={handleChange} className="border p-2 w-full">
        {Object.values(TipoAccion).map((accion) => (
          <option key={accion} value={accion}>{accion}</option>
        ))}
      </select>
      <select name="estado_accion" onChange={handleChange} className="border p-2 w-full">
        {Object.values(EstadoAccion).map((estado) => (
          <option key={estado} value={estado}>{estado}</option>
        ))}
      </select>
      <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Registrar Rechazo</button>
    </form>
  );
}