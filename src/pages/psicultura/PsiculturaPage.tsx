import PageTitle from "@/components/atoms/PageTitle";
import CustomCard from "@/components/atoms/Card";
import { Fish, Wheat, BarChart2 } from "lucide-react";
import CustomButton from "@/components/atoms/CustomButton";
import { useEffect, useState } from "react";
import ConfigBrokerForm from "./components/ConfigBrokerForm";
import ConfigTimerForm from "./components/ConfigTimerForm";
import CustomModal from "@/components/organisms/CustomModal";
import { useDisclosure } from "@heroui/modal";
import ReportDownloader from "./components/ReportDownloader";
import { usePiscicultura } from "@/hooks/default/usePsicultura";
import useProfile from "@/hooks/auth/useProfile";
import PisciculturaTable from "../psicultura/components/PsiculturaTable";
import { axiosAPI } from "@/api/axiosAPI";
import BrokerStateChart from "./components/BrokerStateChart";

export default function PisciculturaPage() {
  const [activeForm, setActiveForm] = useState<
    "reportes" | "timer" | "broker" | null
  >(null);
  const [isOn, setIsOn] = useState(false);
  const [registrosTabla, setRegistrosTabla] = useState<any[]>([]);

  const { profile } = useProfile();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { info, cambiarEstado, obtenerHistorial, obtenerData } =
    usePiscicultura(1);

  const userFullName = profile
    ? `${profile.primerNombre} ${profile.primerApellido}`
    : "Cargando...";

  const cargarTodosLosRegistros = async () => {
    try {
      const { data: info } = await axiosAPI.get("/psicultura/info");
      const manuales = await obtenerHistorial(1);
      const datos = await obtenerData();

      const datosNormalizados = datos.map((d: any) => ({
        id: d.id,
        estado: d.estado,
        modo: d.modo,
        createdAt: d.fechaCreacion ?? new Date().toISOString(),
        inicio: d.ultimaActivacion,
        fin: d.ultimaDesactivacion,
        tiempoMs: d.tiempoMs,
        tipo: "broker",
      }));

      console.log("INFO desde backend:", info);

      console.log("📜 Historial manual → manuales:", manuales);
      console.log("📜 Historial datos:", datos);

      // Combinar
      let combinados = [info, ...manuales, ...datosNormalizados];

      // Ordenar correctamente
      combinados = combinados.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      console.log("🧩 Combinados ordenados:", combinados);

      setRegistrosTabla(combinados);
      return combinados;
    } catch (error) {
      console.error("Error cargando registros:", error);
      return [];
    }
  };

  const refrescarToggle = (registros: any[]) => {
    if (!registros || registros.length === 0)
      return { estado: false, origen: null };

    // MANUAL REALMENTE ABIERTO
    const manualAbierto = registros.find(
      (r) => r.modo === "manual" && (r.fin === null || !r.fin)
    );

    if (manualAbierto) {
      return { estado: manualAbierto.estado === true, origen: "manual" };
    }

    // AUTOMÁTICO REALMENTE ENCENDIDO
    const autoEncendido = registros.find(
      (r) => r.modo === "auto" && r.estado === true
    );

    if (autoEncendido) {
      return { estado: true, origen: "automatico" };
    }

    return { estado: false, origen: null };
  };

  // Polling actualizado
  useEffect(() => {
    let mounted = true;

    const refrescar = async () => {
      console.log("Polling → refrescando registros y toggle...");
      try {
        const { data: autos } = await axiosAPI.get("/psicultura/info");
        const manuales = await obtenerHistorial(1);
        const datos = await obtenerData();
        const combinados = [...autos, ...manuales, ...datos];

        if (!mounted) return;

        setRegistrosTabla(combinados);

        const nuevoToggle = refrescarToggle(combinados);
        setIsOn(nuevoToggle.estado);

        console.log("Polling → toggle actualizado:", nuevoToggle);
      } catch (err) {
        console.error("Polling → Error:", err);
      }
    };

    refrescar(); // fetch inicial
    const interval = setInterval(refrescar, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Toggle manual
  const toggle = async () => {
    if (!info) return;

    try {
      const nuevoEstado = !isOn;
      console.log("Toggle manual → nuevoEstado:", nuevoEstado);

      await cambiarEstado(info.id, nuevoEstado, true); // siempre manual

      console.log("🟢 toggle() → estado actual antes de cambiar:", isOn);
      console.log("🟠 toggle() → nuevoEstado enviado:", nuevoEstado);

      const registros = await cargarTodosLosRegistros();

      const nuevoToggle = refrescarToggle(registros);

      console.log("🔵 toggle() → registros después del cambio:", registros);
      console.log("🔵 toggle() → toggle calculado:", nuevoToggle);

      setIsOn(nuevoToggle.estado);
      console.log("Toggle manual → toggle actualizado:", nuevoToggle);
    } catch (err) {
      console.error("Toggle manual → Error:", err);
    }
  };

  return (
    <>
      <PageTitle>Piscicultura</PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
        <CustomCard title="Control de Estanques" icon={<Fish size={40} />}>
          <p>Monitoreo de niveles, oxígeno y limpieza de estanques.</p>
        </CustomCard>

        <CustomCard title="Alimentación" icon={<Wheat size={40} />}>
          <p>Gestión de raciones, horarios y consumo de alimento.</p>
        </CustomCard>

        <CustomCard title="Crecimiento" icon={<BarChart2 size={40} />}>
          <p>Seguimiento del peso, talla y estado sanitario del pez.</p>
        </CustomCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <CustomButton
          onPress={() => {
            setActiveForm("reportes");
            onOpen();
          }}
        >
          Reportes
        </CustomButton>
        <CustomButton
          onPress={() => {
            setActiveForm("timer");
            onOpen();
          }}
        >
          Configurar Tiempo
        </CustomButton>
        <CustomButton
          onPress={() => {
            setActiveForm("broker");
            onOpen();
          }}
        >
          Configuración Broker
        </CustomButton>
      </div>

      {/* Modal Único */}
      <CustomModal
        title={
          activeForm === "timer"
            ? "Configurar Timer"
            : activeForm === "broker"
              ? "Configuración del Broker"
              : activeForm === "reportes"
                ? "Reporte Piscicultura"
                : ""
        }
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <button
          onClick={() => onOpenChange()}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
        {activeForm === "timer" && (
          <ConfigTimerForm
            onClose={async () => {
              onOpenChange();
              await cargarTodosLosRegistros();
            }}
          />
        )}
        {activeForm === "broker" && <ConfigBrokerForm />}
        {activeForm === "reportes" && (
          <ReportDownloader
            onClose={onOpenChange}
            userName={userFullName}
            registros={registrosTabla}
          />
        )}
      </CustomModal>

      <div className="flex justify-center mt-10">
        <div
          onClick={toggle}
          className={`relative w-56 h-28 rounded-full cursor-pointer flex items-center select-none transition-colors duration-300 ${isOn ? "bg-green-500" : "bg-red-500"}`}
        >
          <span
            className={`absolute text-white text-3xl font-extrabold tracking-wide z-20 transition-all duration-300 ${isOn ? "left-6" : "right-6"}`}
          >
            {isOn ? "ON" : "OFF"}
          </span>
          <div
            className={`absolute w-24 h-24 bg-white rounded-full shadow-2xl transition-all duration-300 z-10 ${isOn ? "translate-x-28" : "translate-x-2"}`}
          />
        </div>
      </div>
      <BrokerStateChart registros={registrosTabla} />
      <PisciculturaTable registros={registrosTabla} userName={userFullName} />
    </>
  );
}
