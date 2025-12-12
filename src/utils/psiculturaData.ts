import { axiosAPI } from "@/api/axiosAPI";

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
  const isFromBroker = endpointName?.includes("broker") === true;

  // Common candidates
  const fechaCreacion =
    r.fechaCreacion ||
    r.timestamp ||
    r.time ||
    r.t ||
    r.fecha ||
    r.createdAt ||
    r.date;
  const inicio = r.inicio || r.start || r.startedAt;
  const fin = r.fin || r.end || r.endedAt;

  const encendidoPor =
    r.encendidoPor ||
    r.user ||
    r.usuario ||
    r.source ||
    r.dispositivo ||
    r.device;
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

  let manual = r.manual !== undefined ? r.manual : undefined;
  if (manual === undefined && r.modo) {
    manual = r.modo === "manual";
  }
  if (
    manual === undefined &&
    (r.source === "fisico" || r.source === "device")
  ) {
    manual = true;
  }

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
    source: isFromBroker ? "external" : "internal",
    raw,
  };
}

export async function fetchAllStoredRecords(psiculturaId?: number) {
  const endpoints: { url: string; name: string }[] = [];

  // add backend history endpoints
  try {
    const infoRes = await axiosAPI.get("/psicultura/info");
    const infoArr = Array.isArray(infoRes.data) ? infoRes.data : [];
    if (psiculturaId) {
      // If specific psiculturaId provided, use only that
      endpoints.push({
        url: `/psicultura/${psiculturaId}/historial`,
        name: "historial",
      });
      endpoints.push({
        url: `/psicultura/${psiculturaId}/datos-guardados?limite=200`,
        name: "datos-guardados",
      });
      endpoints.push({
        url: `/psicultura/${psiculturaId}/estadisticas-datos?horas=24`,
        name: "estadisticas-datos",
      });
    } else {
      // If no specific id, fetch from all psicultura
      infoArr.forEach((psic: any) => {
        if (psic.id) {
          endpoints.push({
            url: `/psicultura/${psic.id}/historial`,
            name: `historial-${psic.id}`,
          });
          endpoints.push({
            url: `/psicultura/${psic.id}/datos-guardados?limite=200`,
            name: `datos-guardados-${psic.id}`,
          });
          endpoints.push({
            url: `/psicultura/${psic.id}/estadisticas-datos?horas=24`,
            name: `estadisticas-datos-${psic.id}`,
          });
        }
      });
    }
    // also generic
    endpoints.push({ url: "/psicultura/historial", name: "historial-generic" });
    endpoints.push({ url: "/psicultura/info", name: "info" });
  } catch (err) {
    // ignore
  }

  // Note: External broker endpoints removed to focus on internal records

  const results: any[] = [];

  await Promise.all(
    endpoints.map(async (ep) => {
      try {
        const res = await axiosAPI.get(ep.url);
        const arr = tryExtractArray(res.data);
        if (arr.length === 0) {
          // maybe res.data itself is array-like or object
          if (Array.isArray(res.data)) {
            arr.push(...res.data);
          } else if (res.data && typeof res.data === "object") {
            // if object has registros or data handled above
            // otherwise if it seems like a single record, push it
            if (Object.keys(res.data).length > 0 && !res.data.fechaCreacion) {
              // ignore
            } else {
              arr.push(res.data);
            }
          }
        }
        arr.forEach((item: any) =>
          results.push({ ...item, _endpointName: ep.name })
        );
      } catch (err) {
        // ignore per-endpoint errors
        console.warn("Error fetching", ep.url, err);
      }
    })
  );

  // Normalize and dedupe
  const normalized = results.map((r) => normalizeRecord(r, r._endpointName));
  const map = new Map<string, any>();
  normalized.forEach((r) => {
    // key by fechaCreacion|inicio|fin|encendidoPor
    const key = `${r.fechaCreacion || ""}|${r.inicio || ""}|${r.fin || ""}|${r.encendidoPor || ""}`;
    if (!map.has(key)) map.set(key, r);
  });

  return Array.from(map.values());
}
