import { useState, useEffect } from 'react';
import { axiosAPI } from '@/api/axiosAPI';
import { connectBroker } from '@/broker/mqttClient';

export function usePiscicultura(id?: number) {
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState<any[]>([]);
  const [realtimeSignals, setRealtimeSignals] = useState<any[]>([]);

  // -------------------------------
  // Funciones REST existentes
  // -------------------------------
  const validarBroker = async (data: any) => {
    setLoading(true);
    const res = await axiosAPI.post('/psicultura/validar', data);
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

  const obtenerHistorial = async (id: number) => {
    setLoading(true);
    const res = await axiosAPI.get(`/psicultura/${id}/historial`);
    setLoading(false);
    setHistorial(res.data);
    return res.data;
  };

  const obtenerInfo = async () => {
    setLoading(true);
    const res = await axiosAPI.get(`/psicultura/info`);
    setLoading(false);
    return res.data;
  };

  // -------------------------------
  // MQTT en tiempo real
  // -------------------------------
  useEffect(() => {
    if (!id) return;

    const client = connectBroker();
    const TOPIC_SIGNALS = 'lab/diego/signals';

    client?.subscribe(TOPIC_SIGNALS, (err: any) => {
      if (err) console.error('Error suscribiéndose al tópico MQTT:', err);
    });

    const handleMessage = (topic: string, message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        setRealtimeSignals((prev) => [data, ...prev]);
      } catch (err) {
        console.error('Error parseando mensaje MQTT:', err);
      }
    };

    client?.on('message', handleMessage);

    return () => {
      client?.removeListener('message', handleMessage);
      client?.end(true);
    };
  }, [id]);

  // -------------------------------
  // Cargar historial inicial si hay ID
  // -------------------------------
  useEffect(() => {
    if (id) {
      obtenerHistorial(id);
    }
  }, [id]);

  return {
    validarBroker,
    actualizarTimer,
    cambiarEstado,
    obtenerEstado,
    obtenerHistorial,
    obtenerInfo,
    historial,
    realtimeSignals,
    loading,
  };
}
