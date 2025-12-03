// File: src/pages/piscicultura/PisciculturaPage.tsx
import PageTitle from "@/components/atoms/PageTitle";
import CustomCard from "@/components/atoms/Card";
import CustomButton from "@/components/atoms/CustomButton";
import { Fish, Wheat, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import ConfigBrokerForm from "./components/ConfigBrokerForm";
import ConfigTimerForm from "./components/ConfigTimerForm";
import CustomModal from "@/components/organisms/CustomModal";
import { useDisclosure } from "@heroui/modal";
import ReportDownloader from "./components/ReportDownloader";
import { usePiscicultura } from "@/hooks/default/usePsicultura";
import useProfile from "@/hooks/auth/useProfile";
import PisciculturaTable from "./components/PsiculturaTable";
import { mqttClient, publish } from "@/broker/mqttClient";

export default function PisciculturaPage() {
  const { profile } = useProfile();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    cambiarEstado,
    obtenerEstado,
    obtenerHistorial,
    obtenerInfo,
    info,
    historial,
    setHistorial,
    bloqueadoRef,
  } = usePiscicultura(1); // if your app uses dynamic id, pass real id

  const [activeForm, setActiveForm] = useState<"reportes" | "timer" | "broker" | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  const userFullName = profile ? `${profile.primerNombre} ${profile.primerApellido}` : "Cargando...";

  // load initial data
  useEffect(() => {
    (async () => {
      const data = await obtenerInfo();
      if (!data) return;
      await obtenerHistorial(data.id);
      const estado = await obtenerEstado(data.id);
      setIsOn(Boolean(estado?.estado));
    })();
  }, [obtenerHistorial, obtenerEstado, obtenerInfo]);

  // handle toggle click (manual)
  const toggle = async () => {
    if (!info?.id) return;
    if (bloqueadoRef.current || bloqueado) return;
    setBloqueado(true);
    bloqueadoRef.current = true;
    try {
      const nuevoEstado = !isOn;
      // call backend to change state (manual)
      const res = await cambiarEstado(info.id, nuevoEstado, true);
      // backend returns historialIdCreated when manual
     if (res.data?.historialIdCreated) {
        // fetch updated historial and set
        const h = await obtenerHistorial(info.id);
        setHistorial(h);
      } else {
        // fallback: update info
        const newInfo = await obtenerInfo();
        if (newInfo) {
          // keep local isOn consistent
          setIsOn(Boolean(newInfo.estado));
        }
      }

      // publish to MQTT for device - publish raw "1"/"0"
      try {
        publish('lab/diego/signals', nuevoEstado ? '1' : '0');
      } catch (err) {
        console.error('Error publicando desde frontend', err);
      }
    } catch (err) {
      console.error('Error toggling', err);
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
        <CustomButton onPress={() => { setActiveForm("reportes"); onOpen(); }}>Reportes</CustomButton>
        <CustomButton onPress={() => { setActiveForm("timer"); onOpen(); }}>Configurar Tiempo</CustomButton>
        <CustomButton onPress={() => { setActiveForm("broker"); onOpen(); }}>Configuración Broker</CustomButton>
      </div>

      <CustomModal
        title={
          activeForm === "timer" ? "Configurar Timer" :
          activeForm === "broker" ? "Configuración del Broker" : "Reporte Piscicultura"
        }
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        {activeForm === "timer" && <ConfigTimerForm onClose={onOpenChange} />}
        {activeForm === "broker" && <ConfigBrokerForm onClose={onOpenChange} />}
        {activeForm === "reportes" && <ReportDownloader onClose={onOpenChange} userName={userFullName} />}
      </CustomModal>

      <div className="flex justify-center mt-10">
        <div
          onClick={toggle}
          className={`relative w-56 h-28 rounded-full cursor-pointer flex items-center select-none transition-colors duration-300 ${isOn ? "bg-green-500" : "bg-red-500"}`}
        >
          <span className={`absolute text-white text-3xl font-extrabold tracking-wide z-20 transition-all duration-300 ${isOn ? "left-6" : "right-6"}`}>{isOn ? "ON" : "OFF"}</span>
          <div className={`absolute w-24 h-24 bg-white rounded-full shadow-2xl transition-all duration-300 z-10 ${isOn ? "translate-x-28" : "translate-x-2"}`} />
        </div>
      </div>

      <PisciculturaTable userName={userFullName} registros={historial} />
    </>
  );
}
