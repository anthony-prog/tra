"use client";

import { useState } from "react";
import { GestionDespachoService } from "@/api/generated";
import type { CreateDespachoDto } from "@/api/generated";



export default function DespachoForm() {
  const [formData, setFormData] = useState<CreateDespachoDto>({
    id_resultado_condicion_despacho: "",
    id_usuario: "",
    estado_recorrido: "en_ruta" as CreateDespachoDto.estado_recorrido,
    observaciones: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await GestionDespachoService.gestionDespachoControllerInsertarDespacho(formData);
      alert("Despacho registrado exitosamente");
    } catch (error) {
      alert("Error al registrar despacho");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="id_resultado_condicion_despacho" placeholder="ID Resultado Condición" onChange={handleChange} className="border p-2 w-full" required />
      <input name="id_usuario" placeholder="ID Usuario" onChange={handleChange} className="border p-2 w-full" required />
      <select name="estado_recorrido" onChange={handleChange} className="border p-2 w-full">
        <option value="en_ruta">En ruta</option>
        <option value="finalizado">Finalizado</option>
      </select>
      <textarea name="observaciones" placeholder="Observaciones" onChange={handleChange} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Registrar</button>
    </form>
  );
}