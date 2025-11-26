import PageTitle from "@/components/atoms/PageTitle";
import CustomCard from "@/components/atoms/Card";
import { Fish, Wheat, BarChart2 } from "lucide-react";
import CustomButton from "@/components/atoms/CustomButton";
import { useState } from "react";
import ConfigBrokerForm from "./components/ConfigBrokerForm";
import ConfigTimerForm from "./components/ConfigTimerForm";
import CustomModal from "@/components/organisms/CustomModal";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import ReportDownloader from "./components/ReportDownloader";

export default function PisciculturaPage() {
  const [activeForm, setActiveForm] = useState<
    "reportes" | "timer" | "broker" | null
  >(null);

  const [isOn, setIsOn] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

      {/* SOLO UN MODAL */}
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
        {activeForm === "timer" && <ConfigTimerForm onClose={onOpenChange} />}
        {activeForm === "broker" && <ConfigBrokerForm onClose={onOpenChange} />}
        {activeForm === "reportes" && (
          <ReportDownloader onClose={onOpenChange} />
        )}
      </CustomModal>

      <div className="flex justify-center mt-10">
        <div
          onClick={() => setIsOn(!isOn)}
          className={`
      relative w-56 h-28 rounded-full cursor-pointer flex items-center select-none
      transition-colors duration-300
      ${isOn ? "bg-green-500" : "bg-red-500"}
    `}
        >
          {/* Texto ON/OFF que se mueve según el estado */}
          <span
            className={`
        absolute text-white text-3xl font-extrabold tracking-wide z-20 transition-all duration-300
        ${isOn ? "left-6" : "right-6"}
      `}
          >
            {isOn ? "ON" : "OFF"}
          </span>

          {/* Thumb */}
          <div
            className={`
        absolute w-24 h-24 bg-white rounded-full shadow-2xl transition-all duration-300 z-10
        ${isOn ? "translate-x-28" : "translate-x-2"}
      `}
          />
        </div>
      </div>
    </>
  );
}
