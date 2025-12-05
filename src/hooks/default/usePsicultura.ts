// File: src/hooks/default/usePiscicultura.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { axiosAPI } from '@/api/axiosAPI';

type PsiculturaInfo = any;
type HistorialItem = any;

export function usePiscicultura(id?: number) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<PsiculturaInfo | null>(null);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);

  const bloqueadoRef = useRef(false);
  const pollRef = useRef<number | null>(null);

  // -------------------------------
  // REST helpers
  // -------------------------------
  const obtenerInfo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosAPI.get('/psicultura/info');
      const data = res.data && res.data.length > 0 ? res.data[0] : null;
      setInfo(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerHistorial = useCallback(async (psiculturaId?: number) => {
    if (!psiculturaId) return [];
    setLoading(true);
    try {
      const res = await axiosAPI.get(`/psicultura/${psiculturaId}/historial`);
      setHistorial(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerEstado = useCallback(async (psiculturaId?: number) => {
    if (!psiculturaId) return null;
    setLoading(true);
    try {
      const res = await axiosAPI.get(`/psicultura/${psiculturaId}/estado`);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarTimer = useCallback(
    async (idParam: number | null, data: any) => {
      setLoading(true);
      try {
        const idPath = idParam == null ? 'null' : String(idParam);
        const res = await axiosAPI.post(`/psicultura/${idPath}/timer`, data);

        await obtenerInfo();
        if (res.data?.id) await obtenerHistorial(res.data.id);

        return res;
      } finally {
        setLoading(false);
      }
    },
    [obtenerHistorial, obtenerInfo]
  );

  const cambiarEstado = useCallback(
    async (psiculturaId: number, estado: boolean, manual = true) => {
      setLoading(true);
      try {
        const endpoint = manual ? 'manual' : 'estado';
        const res = await axiosAPI.post(`/psicultura/${psiculturaId}/${endpoint}`, {
          activo: estado,
          manual,
        });

        if (manual) {
          await obtenerHistorial(psiculturaId);
        } else {
          await obtenerInfo();
        }

        return res;
      } finally {
        setLoading(false);
      }
    },
    [obtenerHistorial, obtenerInfo]
  );

  // -------------------------------
  // Polling periódico (5s) para automático
  // -------------------------------
  useEffect(() => {
    if (!id) return;

    const startPolling = () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = window.setInterval(async () => {
        if (bloqueadoRef.current) return;

        try {
          const currentInfo = await obtenerInfo();
          if (!currentInfo) return;
          if (currentInfo.estadoActual !== 'automatico') return;

          const estado = await obtenerEstado(currentInfo.id);
          if (estado) {
            setInfo((prev:any) => prev ? { ...prev, estado: estado.estado, estadoActual: estado.estadoActual } : prev);
          }
        } catch (err) {
          console.error('Error en polling psicultura', err);
        }
      }, 5000);
    };

    startPolling();
    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [id, obtenerInfo, obtenerEstado]);

  // -------------------------------
  // API pública del hook
  // -------------------------------
  return {
    info,
    historial,
    loading,
    bloqueadoRef,
    obtenerInfo,
    obtenerHistorial,
    obtenerEstado,
    actualizarTimer,
    cambiarEstado,
    setHistorial,
  };
}
