import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button, Input } from "@heroui/react";
import * as XLSX from "xlsx";
import { axiosAPI } from "@/api/axiosAPI";

interface Props {
  onClose: () => void;
  userName: string;
}

export default function ReportDownloader({ onClose, userName }: Props) {
  const [fecha, setFecha] = useState("");

  const [reportes, setReportes] = useState<any[]>([]);

  const fetchReportesDelDia = async () => {
    if (!fecha) return;

    try {
      const { data } = await axiosAPI.get("/psicultura/info");

      const registrosFiltrados = data.filter((r: any) => {
        const f = new Date(r.fechaCreacion);
        const fechaDB = f.toISOString().split("T")[0]; 
        return fechaDB === fecha; 
      });

      setReportes(registrosFiltrados);
    } catch (error) {
      console.error("Error al obtener registros:", error);
    }
  };

  useEffect(() => {
    fetchReportesDelDia();
  }, [fecha]);

  const downloadReport = () => {
    if (reportes.length === 0) {
      alert("No hay registros para esta fecha.");
      return;
    }

const filas = reportes.map((r) => {
  const fechaOriginal = r.fechaCreacion.split("T")[0]; 
  const diaOriginal = fechaOriginal.split("-")[2];     

  const f = new Date(r.fechaCreacion);

  return [
    diaOriginal,              
    fechaOriginal,          
    f.toLocaleTimeString("es-CO", { hour12: true }), 
    f.getFullYear(),          
    r.encendidoPor || userName || "N/A",
    r.apagadoPor || userName || "N/A",
    r.tiempoEncendido,
    r.tiempoApagado,
    r.tiempoMs,
    r.estado,
    r.modo,
    r.inicio,
    r.fin,
  ];
});


    const data = [
      ["REPORTE DE PISCICULTURA"],
      [`Fecha seleccionada: ${fecha}`],
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
        "TIEMPO MANUAL",
        "ESTADO",
        "MODO",
        "INICIO",
        "FIN",
      ],
      ...filas, 
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    XLSX.writeFile(wb, `reporte_piscicultura_${fecha}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2 p-6">
        <label className="font-semibold text-sm">
          Filtrar reporte por fecha:
        </label>
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
