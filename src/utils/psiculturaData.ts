import { axiosAPI } from '@/api/axiosAPI';

function tryExtractArray(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.registros)) return data.registros;
  if (Array.isArray(data.records)) return data.records;
  return [];
}

function parseToISO(val: any): string | undefined {
  if (!val) return undefined;
  // if already ISO-like
  const s = String(val);
  // try Date parse
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString();
  return undefined;
}

function normalizeRecord(r: any, endpointName?: string): any {
  // Keep original as raw
  const raw = r;

  // Determine if this record comes from external broker endpoints
  const isFromBroker = endpointName?.includes('broker') === true;

  // Common candidates
  const fechaCreacion = r.fechaCreacion || r.timestamp || r.time || r.t || r.fecha || r.createdAt || r.date;
  const inicio = r.inicio || r.start || r.startedAt;
  const fin = r.fin || r.end || r.endedAt;

  const encendidoPor = r.encendidoPor || r.user || r.usuario || r.source || r.dispositivo || r.device;
  const apagadoPor = r.apagadoPor || r.userOff || r.usuarioOff;

  const modo = r.modo || r.mode || r.tipo;

  // estado: try boolean
  let estado: boolean | null = null;
  if (r.estado !== undefined) estado = Boolean(r.estado);
  else if (r.activo !== undefined) estado = Boolean(r.activo);
  else if (r.value !== undefined) estado = Boolean(r.value);
  else if (r.on !== undefined) estado = Boolean(r.on);

  const tiempoEncendido = r.TiempoEncendido || r.tiempoEncendido || r.timeOn;
  const tiempoApagado = r.tiempoApagado || r.timeOff;
  const tiempoMs = r.tiempoMs || r.durationMs || r.manualMs || null;

  const manual = r.manual !== undefined ? r.manual : (r.source === 'fisico' || r.source === 'device' ? true : undefined);

  return {
    fechaCreacion: parseToISO(fechaCreacion),
    inicio: parseToISO(inicio),
    fin: parseToISO(fin),
    encendidoPor,
    apagadoPor,
    modo,
    estado,
    tiempoEncendido,
    tiempoApagado,
    tiempoMs,
    manual,
    source: isFromBroker ? 'external' : 'internal',
    raw,
  };
}

export async function fetchAllStoredRecords(psiculturaId?: number) {
  const endpoints: { url: string; name: string }[] = [];

  // add backend history endpoints
  try {
    const infoRes = await axiosAPI.get('/psicultura/info');
    const infoArr = Array.isArray(infoRes.data) ? infoRes.data : [];
    const mainId = psiculturaId || (infoArr.length > 0 ? infoArr[0].id : undefined);
    if (mainId) {
      endpoints.push({ url: `/psicultura/${mainId}/historial`, name: 'historial' });
      endpoints.push({ url: `/psicultura/${mainId}/datos-guardados?limite=200`, name: 'datos-guardados' });
      endpoints.push({ url: `/psicultura/${mainId}/estadisticas-datos?horas=24`, name: 'estadisticas-datos' });
    }
    // also generic
    endpoints.push({ url: '/psicultura/historial', name: 'historial-generic' });
  } catch (err) {
    // ignore
  }

  // add external broker endpoints (absolute)
  endpoints.push({ url: 'http://localhost:3000/', name: 'broker-root' });
  endpoints.push({ url: 'http://localhost:3000/api/datos-broker', name: 'broker-api' });
  endpoints.push({ url: `http://localhost:3000/psicultura/${psiculturaId || 1}/datos-guardados?limite=200`, name: 'broker-guardados' });
  endpoints.push({ url: `http://localhost:3000/psicultura/${psiculturaId || 1}/estadisticas-datos?horas=24`, name: 'broker-estadisticas' });

  const results: any[] = [];

  await Promise.all(
    endpoints.map(async (ep) => {
      try {
        const res = await axiosAPI.get(ep.url);
        const arr = tryExtractArray(res.data) ;
        if (arr.length === 0) {
          // maybe res.data itself is array-like or object
          if (Array.isArray(res.data)) {
            arr.push(...res.data);
          } else if (res.data && typeof res.data === 'object') {
            // if object has registros or data handled above
            // otherwise if it seems like a single record, push it
            if (Object.keys(res.data).length > 0 && !res.data.fechaCreacion) {
              // ignore
            } else {
              arr.push(res.data);
            }
          }
        }
        arr.forEach((item: any) => results.push({ ...item, _endpointName: ep.name }));
      } catch (err) {
        // ignore per-endpoint errors
        console.warn('Error fetching', ep.url, err);
      }
    })
  );

  // Normalize and dedupe
  const normalized = results.map((r) => normalizeRecord(r, r._endpointName));
  const map = new Map<string, any>();
  normalized.forEach((r) => {
    // key by fechaCreacion|inicio|fin|encendidoPor
    const key = `${r.fechaCreacion || ''}|${r.inicio || ''}|${r.fin || ''}|${r.encendidoPor || ''}`;
    if (!map.has(key)) map.set(key, r);
  });

  return Array.from(map.values());
}
