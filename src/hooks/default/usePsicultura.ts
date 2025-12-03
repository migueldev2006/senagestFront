// File: src/hooks/default/usePiscicultura.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { axiosAPI } from '@/api/axiosAPI';
import { connectBroker } from '@/broker/mqttClient';

type PsiculturaInfo = any;
type HistorialItem = any;

export function usePiscicultura(id?: number) {
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [info, setInfo] = useState<PsiculturaInfo | null>(null);
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

  const validarBroker = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const res = await axiosAPI.post('/psicultura/validar', data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  // actualizarTimer: según backend actual debe usar PATCH /psicultura/null|new/timer
  const actualizarTimer = useCallback(async (idParam: number | null, data: any) => {
    setLoading(true);
    try {
      const idPath = idParam == null ? 'null' : String(idParam);
      const res = await axiosAPI.patch(`/psicultura/${idPath}/timer`, data);
      // backend crea nuevo registro si id==null or per your design creates new one each update
      // recargar info e historial del registro nuevo (si res.id)
      await obtenerInfo();
      if (res.data?.id) await obtenerHistorial(res.data.id);

      return res;
    } finally {
      setLoading(false);
    }
  }, [obtenerHistorial, obtenerInfo]);

  const cambiarEstado = useCallback(async (psiculturaId: number, estado: boolean, manual = true) => {
    setLoading(true);
    try {
      const res = await axiosAPI.patch(`/psicultura/${psiculturaId}/estado`, {
        activo: estado,
        manual,
      });
      // backend returns historialIdCreated when manual; update local state immediately
      if (manual && res.data?.historialIdCreated) {

        // fetch inserted historial item and prepend
        const newHist = await axiosAPI.get(`/psicultura/${psiculturaId}/historial`);
        setHistorial(newHist.data);
      } else {
        // for automatic/manual state updates, refresh info
        const updatedInfo = await obtenerInfo();
        if (updatedInfo && updatedInfo.id === psiculturaId) setInfo(updatedInfo);
      }
      return res;
    } finally {
      setLoading(false);
    }
  }, [obtenerInfo]);

  // -------------------------------
  // MQTT: suscripción y manejo centralizado
  // -------------------------------
  useEffect(() => {
    if (!id) return;

    const client = connectBroker();
    clientRef.current = client;

    const TOPIC_SIGNALS = 'lab/diego/signals';
    // ensure subscribe (if already subscribed on other parts, safe)
    client.subscribe(TOPIC_SIGNALS, (err: any) => {
      if (err) console.error('Error suscribiéndose al tópico MQTT:', err);
      else console.log('Suscrito a:', TOPIC_SIGNALS);
    });

    client.on('connect', () => {
      setIsConnectedMQTT(true);
    });

    client.on('close', () => setIsConnectedMQTT(false));
    client.on('offline', () => setIsConnectedMQTT(false));
    client.on('reconnect', () => setIsConnectedMQTT(false));

    const handleMessage = async (topic: string, message: Buffer) => {
      const raw = message.toString();
      // simple de-bounce using ts
      const now = Date.now();
      if (now - lastPayloadTs.current < 150) {
        // ignore very fast duplicates
      }
      lastPayloadTs.current = now;

      // payload puede llegar "1" o "0" o JSON
      let parsed: any = raw;
      try { parsed = JSON.parse(raw); } catch { /* keep raw */ }

      // unify to '1' | '0' string or boolean
      let payloadVal: string | null = null;
      if (typeof parsed === 'object') {
        if (parsed.estado !== undefined) payloadVal = String(parsed.estado);
        else if (parsed.s1_raw !== undefined) payloadVal = parsed.s1_raw ? '1' : '0';
      } else {
        // raw string "1"/"0"/"true"/"false"
        if (raw === '1' || raw === '0') payloadVal = raw;
        else if (raw === 'true' || raw === 'false') payloadVal = raw === 'true' ? '1' : '0';
        else payloadVal = raw;
      }

      setRealtimeSignals(prev => [{ topic, payload: payloadVal, raw, ts: now }, ...prev].slice(0, 50));

      // apply update: fetch info from backend and update local state,
      // backend will handle whether that payload was manual and create hist if needed.
      try {
        const infos = await obtenerInfo();
        if (!infos) return;
        // backend may have multiple records; we use current shown id if any
        const currentId = id;
        // call handle broker endpoint to process and persist (optional if backend MQTT handles it)
        // we will attempt to update local view by re-fetching estado/historial
        const estado = await obtenerEstado(currentId);
        if (estado) {
          // if backend says manual, refresh historial
          if (estado.estadoActual === 'manual') {
            await obtenerHistorial(currentId);
          }
          // update info object
          const newInfo = await obtenerInfo();
          setInfo(newInfo);
        }
      } catch (err) {
        console.error('Error procesando payload MQTT en frontend', err);
      }
    };

    client.on('message', handleMessage);

    return () => {
      client.removeListener('message', handleMessage);
      try { client.end(true); } catch { /* ignore */ }
      clientRef.current = null;
    };
  }, [id, obtenerHistorial, obtenerEstado, obtenerInfo]);

  // -------------------------------
  // Polling periódico para sincronizar estado (cada 5s)
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
          // solo refrescar estado si modo auto (evita pisar manual)
          if (currentInfo.estadoActual === 'automatico') {
            const estado = await obtenerEstado(currentInfo.id);
            if (estado && estado.estado !== undefined) {
              // if there's a change, update local UI
              setInfo((prev: any) => prev ? { ...prev, estado: estado.estado, estadoActual: estado.estadoActual } : prev);
            }
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
  }, [id, obtenerEstado, obtenerInfo]);

  // -------------------------------
  // Public API
  // -------------------------------
  return {
    validarBroker,
    actualizarTimer,
    cambiarEstado,
    obtenerEstado,
    obtenerHistorial,
    obtenerInfo,
    info,
    historial,
    realtimeSignals,
    isConnectedMQTT,
    loading,
    setHistorial, // expose to allow page to insert local changes after manual actions
    bloqueadoRef,
  };
}
