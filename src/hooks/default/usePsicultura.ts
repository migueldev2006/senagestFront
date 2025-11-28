import { axiosAPI } from "@/api/axiosAPI";
import { useState } from "react";

export function usePiscicultura() {
  const [loading, setLoading] = useState(false);

  const validarBroker = async (data: any) => {
    setLoading(true);
    const res = await axiosAPI.post("/psicultura/validar", data);
    setLoading(false);
    return res.data;
  };

  const actualizarTimer = async (id: number, data: any) => {
    setLoading(true);
    const res = await axiosAPI.patch(`/psicultura/${id}/timer`, data);
    setLoading(false);
    return res.data;
  };

  const cambiarEstado = async (id: number, estado: boolean, manual = true) => {
    setLoading(true);
    const res = await axiosAPI.patch(`/psicultura/${id}/estado`, {
      activo: estado,
      manual,
    });
    setLoading(false);
    return res.data;
  };

  const obtenerEstado = async (id: number) => {
    setLoading(true);
    const res = await axiosAPI.get(`/psicultura/${id}/estado`);
    setLoading(false);
    return res.data;
  };

  // traer información del timer
  const [timerActual, setTimerActual] = useState<{
    TiempoEncendido: string;
    tiempoApagado: string;
  } | null>(null);

  const obtenerTimer = async (id: number) => {
    setLoading(true);
    const res = await axiosAPI.get(`/psicultura/${id}/timer`);
    setLoading(false);
    setTimerActual(res.data); // se asume que el backend devuelve {TiempoEncendido, tiempoApagado}
    return res.data;
  };

  return {
    validarBroker,
    actualizarTimer,
    cambiarEstado,
    obtenerEstado,
    obtenerTimer,
    timerActual,
    loading,
  };
}
