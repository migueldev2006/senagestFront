import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button, Input } from "@heroui/react";
import * as XLSX from "xlsx";
import { usePiscicultura } from "@/hooks/default/usePsicultura";
import { axiosAPI } from '@/api/axiosAPI'


interface Props {
  onClose: () => void;
  userName: string;
}

export default function ReportDownloader({ onClose, userName }: Props) {
  const [fecha, setFecha] = useState("");
  const { obtenerTimer, timerActual } = usePiscicultura();
  const [tiempoEncendido, setTiempoEncendido] = useState("");
  const [tiempoApagado, setTiempoApagado] = useState("");
const [horaCreacion, setHoraCreacion] = useState("");  
const dia = fecha ? fecha.split("-")[2] : "";


const fetchTimer = async () => {
  try {
    const { data } = await axiosAPI.get("/psicultura/info");
    if (data && data.length > 0) {
      const timer = data[0];

      setTiempoEncendido(timer.TiempoEncendido);
      setTiempoApagado(timer.tiempoApagado);

      const fecha = new Date(timer.fechaCreacion);
      const hora = fecha.toLocaleTimeString("es-CO", { hour12: true });
      const año = fecha.getFullYear(); // <-- aquí obtienes el año

      setHoraCreacion(hora);
      setAño(año); // necesitas un estado llamado setAño
    }
  } catch (error) {
    console.error("Error al obtener el timer:", error);
  }
};



useEffect(() => {
  fetchTimer();
}, []);


useEffect(() => {
  const fetchTimer = async () => {
    const data = await obtenerTimer(1);
    setTiempoEncendido(data.TiempoEncendido);
    setTiempoApagado(data.tiempoApagado);

    if (data.fechaCreacion) {
      const fecha = new Date(data.fechaCreacion);
      const hora = fecha.toLocaleTimeString("es-CO", { hour12: false });
      setHoraCreacion(hora);
    }
  };
  fetchTimer();
}, []);


  // Función para generar el Excel
  const downloadReport = () => {
    const data = [
      ["REPORTE DE PISCICULTURA (PRUEBA)"],
      [
        "Este reporte contiene un resumen general del estado de la piscicultura, incluyendo los parámetros principales monitoreados durante las fechas filtradas por el usuario.",
      ],
      [`Fecha seleccionada: ${fecha || "No especificada"}`],
      [],
      [
        "DIA",
        "FECHA",
        "HORA",
        "AÑO",
        "QUIÉN ENCENDIÓ",
        "QUIÉN APAGÓ",
        "TIEMPO ENCENDIDO",
        "TIEMPO APAGADO",
      ],
      [
        dia, 
        fecha,
        horaCreacion,
        setAño,
        userName,
        userName,
        tiempoEncendido,
        tiempoApagado,
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `reporte_piscicultura_${fecha || "prueba"}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2 p-6">
        <label className="font-semibold text-sm">Filtrar reporte por fecha:</label>
        <Input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl">
        <p className="text-gray-700 text-sm flex-1 pr-4">
          <h1 className="font-semibold">REPORTE MONITOREO</h1>
          Este reporte contiene un resumen general del estado de la piscicultura.
        </p>

        <button
          onClick={downloadReport}
          className="p-3 rounded-full hover:bg-gray-200 transition"
        >
          <Download size={40} className="text-blue-600" />
        </button>
      </div>

      <Button type="button" color="danger" variant="light" onPress={onClose}>
        Cancelar
      </Button>
    </div>
  );
}
function setAño(año: number) {
  throw new Error("Function not implemented.");
}

