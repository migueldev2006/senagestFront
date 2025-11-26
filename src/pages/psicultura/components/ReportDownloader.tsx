import { useState } from "react";
import { Download } from "lucide-react";
import { Button, Input } from "@heroui/react"; // Input de fecha

interface Props {
  onClose: () => void;
}

export default function ReportDownloader({ onClose }: Props) {
  const [fecha, setFecha] = useState("");

  const downloadFakeReport = () => {
    const contenido = `
REPORTE DE PISCICULTURA (PRUEBA)
--------------------------------
Fecha seleccionada: ${fecha || "No especificada"}

Reporte resumido de los parámetros principales del sistema de piscicultura.
Incluye información de estanques, oxigenación, alimentación y estado general.

-------------------------------------------------------------------------------------------------------------------------
|DIA  |     FECHA   |   HORA    |   AÑO     |   QUIEN LO ENCENDIO   |   QUIEN LO APAGO  |    TIEMPO QUE DURÓ ENCENDIDO   |
-------------------------------------------------------------------------------------------------------------------------
|     |             |           |           |                        |                    |                              |    
`;

    const blob = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_piscicultura_${fecha || "prueba"}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* FILTRO POR FECHA */}
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

      {/* CONTENEDOR DESCRIPCIÓN + ICONO */}
      <div className="flex items-center justify-between bg-gray-100 p-4 rounded-xl">
        {/* DESCRIPCIÓN SIMPLE */}
        <p className="text-gray-700 text-sm flex-1 pr-4">
          <h1 className="font-semibold">REPORTE MONITOREO</h1>
          Este reporte contiene un resumen general del estado de la
          piscicultura, incluyendo los parámetros principales monitoreados
          durante el día.
        </p>

        {/* ICONO DE DESCARGA */}
        <button
          onClick={downloadFakeReport}
          className="p-3 rounded-full hover:bg-gray-200 transition"
        >
          <Download size={40} className="text-blue-600" />
        </button>
      </div>

      {/* BOTÓN CERRAR */}
      <Button type="button" color="danger" variant="light" onPress={onClose}>
        Cancelar
      </Button>
    </div>
  );
}
