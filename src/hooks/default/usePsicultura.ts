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
    await obtenerInfo();
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

  const obtenerHistorial = async (id: number) => {
    setLoading(true);
    const res = await axiosAPI.get(`/psicultura/${id}/historial`);
    setLoading(false);
    return res.data;
  };

  const obtenerInfo = async () => {
    setLoading(true);
    const res = await axiosAPI.get(`/psicultura/info`);
    setLoading(false);
    return res.data;
  };

  return {
    validarBroker,
    actualizarTimer,
    cambiarEstado,
    obtenerEstado,
    obtenerHistorial,
    obtenerInfo,
    loading,
  };
}
