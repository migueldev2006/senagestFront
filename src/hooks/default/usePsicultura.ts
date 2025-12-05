// File: src/hooks/default/usePiscicultura.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { axiosAPI } from '@/api/axiosAPI';
import { getClient } from '@/broker/mqttClient';

type PsiculturaInfo = any;
type HistorialItem = any;

export function usePiscicultura(id?: number) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<PsiculturaInfo | null>(null);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
   const [isConnectedMQTT, setIsConnectedMQTT] = useState(false);
  const [realtimeSignals, setRealtimeSignals] = useState<any[]>([]);
  const bloqueadoRef = useRef(false);
  const pollRef = useRef<number | null>(null);
  const clientRef = useRef<any>(null);
  const lastPayloadTs = useRef<number>(0);


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

    const guardarConfigBroker = useCallback(async (form: any) => {
    setLoading(true);
    try {
      const res = await axiosAPI.post('/psicultura/broker/config/save', form);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const validarBroker = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const res = await axiosAPI.post('/psicultura/validar', data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const client = getClient();
    if (!client) return;
    clientRef.current = client;

    const TOPIC_SIGNALS = 'lab/diego/signals';
    client.subscribe(TOPIC_SIGNALS, (err: any) => {
      if (err) console.error('Error suscribiéndose al tópico MQTT:', err);
      else console.log('Suscrito a:', TOPIC_SIGNALS);
    });

    client.on('connect', () => setIsConnectedMQTT(true));
    client.on('close', () => setIsConnectedMQTT(false));
    client.on('offline', () => setIsConnectedMQTT(false));
    client.on('reconnect', () => setIsConnectedMQTT(false));

    const handleMessage = async (topic: string, message: Buffer) => {
      const raw = message.toString();
      const now = Date.now();
      if (now - lastPayloadTs.current < 150) {}
      lastPayloadTs.current = now;

      let parsed: any = raw;
      try { parsed = JSON.parse(raw); } catch {}

      let payloadVal: string | null = null;
      if (typeof parsed === 'object') {
        if (parsed.estado !== undefined) payloadVal = String(parsed.estado);
        else if (parsed.s1_raw !== undefined) payloadVal = parsed.s1_raw ? '1' : '0';
      } else {
        if (raw === '1' || raw === '0') payloadVal = raw;
        else if (raw === 'true' || raw === 'false') payloadVal = raw === 'true' ? '1' : '0';
        else payloadVal = raw;
      }

      setRealtimeSignals(prev => [{ topic, payload: payloadVal, raw, ts: now }, ...prev].slice(0, 50));

      try {
        const infos = await obtenerInfo();
        if (!infos) return;

        const estado = await obtenerEstado(id);
        if (estado) {
          if (estado.estadoActual === 'manual') {
            await obtenerHistorial(id);
          }
          const newInfo = await obtenerInfo();
          setInfo(newInfo);
        }
      } catch (err) {
        console.error('Error procesando payload MQTT en frontend', err);
      }
    };

    client.on('message', handleMessage);

    return () => {
      try { client.removeListener('message', handleMessage); } catch {}
      clientRef.current = null;
    };
  }, [id, obtenerHistorial, obtenerEstado, obtenerInfo]);

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
    guardarConfigBroker,
    validarBroker,
    isConnectedMQTT,
    realtimeSignals,
  };
}
