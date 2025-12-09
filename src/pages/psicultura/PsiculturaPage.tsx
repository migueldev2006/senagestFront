// File: src/pages/piscicultura/PisciculturaPage.tsx
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
import { publish } from "@/broker/mqttClient";
import { fetchAllStoredRecords } from "@/utils/psiculturaData";
import { useRef } from "react";

export default function PisciculturaPage() {
  const [activeForm, setActiveForm] = useState<
    "reportes" | "timer" | "broker" | null
  >(null);
  const [isOn, setIsOn] = useState(false);
  const [registrosTabla, setRegistrosTabla] = useState<any[]>([]);

  const { profile } = useProfile();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { info, cambiarEstado, obtenerHistorial } =
    usePiscicultura(1);
  const [bloqueado, setBloqueado] = useState(false);
  const bloqueadoRef = useRef(false);

  const userFullName = profile
    ? `${profile.primerNombre} ${profile.primerApellido}`
    : "Cargando...";

const cargarTodosLosRegistros = async () => {
  try {
    // lo que ya tenías
    const { data: autos } = await axiosAPI.get("/psicultura/info");
    const manuales = await obtenerHistorial(1);

    // ✔ nuevo: cargar registros combinados desde el broker/backend
    let registrosBroker = [];
    try {
      registrosBroker = await fetchAllStoredRecords(1);
    } catch (err) {
      console.warn("No se pudieron obtener registros del broker:", err);
    }

    // ✔ combinar todo manteniendo tu lógica original
    const combinados = [...autos, ...manuales, ...registrosBroker];

    // actualizar tu tabla
    setRegistrosTabla(combinados);

    return combinados;
  } catch (error) {
    console.error("Error cargando registros:", error);
    return [];
  }
};


  const refrescarToggle = (registros: any[]) => {
    if (!registros || registros.length === 0) return false;

    const ultimoRegistro = registros.reduce((prev, curr) =>
      curr.id > prev.id ? curr : prev
    );

    if (!ultimoRegistro || !ultimoRegistro.estadoActual) return false;

    const estadoActual = ultimoRegistro.estadoActual.toLowerCase();
    const estadoBool =
      (estadoActual === "manual" || estadoActual === "automatico") &&
      ultimoRegistro.estado === true;

    return estadoBool;
  };

  // Polling actualizado
  useEffect(() => {
    let mounted = true;

    const refrescar = async () => {
      console.log("Polling → refrescando registros y toggle...");
      try {
        const { data: autos } = await axiosAPI.get("/psicultura/info");
        const manuales = await obtenerHistorial(1);
        const combinados = [...autos, ...manuales];

        if (!mounted) return;

        setRegistrosTabla(combinados);

        const nuevoToggle = refrescarToggle(combinados);
        setIsOn(nuevoToggle);
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
  if (bloqueado || bloqueadoRef.current) return;

  setBloqueado(true);
  bloqueadoRef.current = true;

  try {
    const nuevoEstado = !isOn;
    console.log("Toggle manual → nuevoEstado:", nuevoEstado);

    // cambiar estado manual
    await cambiarEstado(info.id, nuevoEstado, true);

    // enviar señal MQTT cruda
    try {
      publish("lab/diego/signals", nuevoEstado ? "1" : "0");
    } catch (err) {
      console.error("Error publicando MQTT desde frontend", err);
    }

    // recargar registros combinados
    const registros = await cargarTodosLosRegistros();
    const nuevoToggle = refrescarToggle(registros);
    setIsOn(nuevoToggle);

  } catch (err) {
    console.error("Toggle manual → Error:", err);
  } finally {
    setTimeout(() => {
      setBloqueado(false);
      bloqueadoRef.current = false;
    }, 1500);
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
        {activeForm === "timer" && (
          <ConfigTimerForm
            onClose={async () => {
              onOpenChange();
              await cargarTodosLosRegistros();
            }}
          />
        )}
        {activeForm === "broker" && <ConfigBrokerForm onClose={onOpenChange} />}

        {activeForm === "reportes" && (
          <ReportDownloader onClose={onOpenChange} userName={userFullName} />
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
