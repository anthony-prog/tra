"use client"

import DespachoForm from "../components/DespachoForm";
import RechazoForm from "../components/RechazoForm";

export default function GestionDespachoDashboard() {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Gestión de Despacho</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Registrar Despacho</h2>
        <DespachoForm />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Registrar Rechazo de Despacho</h2>
        <RechazoForm />
      </div>
    </div>
  );
}