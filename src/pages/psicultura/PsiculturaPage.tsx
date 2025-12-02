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

// MQTT
import { connectBroker, mqttClient } from "@/broker/mqttClient";

export default function PisciculturaPage() {
  const [activeForm, setActiveForm] = useState<
    "reportes" | "timer" | "broker" | null
  >(null);

  const [isOn, setIsOn] = useState(false);
  const { profile } = useProfile();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { cambiarEstado, obtenerEstado, obtenerHistorial, obtenerInfo } =
    usePiscicultura();

  const [registrosTabla, setRegistrosTabla] = useState<any[]>([]);
  const [psiculturaId, setPsiculturaId] = useState<number | null>(null);
  const [registroActivoId, setRegistroActivoId] = useState<number | null>(null);

  const [bloqueado, setBloqueado] = useState(false);
  const [mqttValor, setMqttValor] = useState<string | null>(null);

  const TOPIC = "lab/diego/signals";

  // ================================
  // 🚀 CARGAR DATOS DESDE BASE DE DATOS
  // ================================
  const cargarDatos = async () => {
    try {
      const info = await obtenerInfo();
      if (!info || info.length === 0) return;

      const main = info[0];
      setPsiculturaId(main.id);

      const historial = await obtenerHistorial(main.id);
      setRegistrosTabla(historial);

      const abierto = historial.find((h: any) => h.fin === null);
      if (abierto) {
        setRegistroActivoId(abierto.id);
        setIsOn(Boolean(abierto.estado));
      } else {
        const estadoMain = await obtenerEstado(main.id);
        setIsOn(Boolean(estadoMain.estado));
        setRegistroActivoId(null);
      }
    } catch (err) {
      console.error("Error cargando datos", err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ================================
  // 🔌 MQTT EN FRONTEND (CONEXIÓN + SUB)
  // ================================
  useEffect(() => {
    const client = connectBroker();

    client.on("connect", () => {
      console.log("⚡ MQTT conectado en frontend");

      client.subscribe(TOPIC, (err: any) => {
        if (!err) console.log("📡 Suscrito a:", TOPIC);
        else console.error("❌ Error al suscribirse:", err);
      });
    });

client.on("message", (topic, message) => {
      const value = message.toString();
      console.log("📩 MQTT recibió:", value);

      setMqttValor(value);

      // sincroniza el toggle automáticamente
      if (value === "true") setIsOn(true);
      if (value === "false") setIsOn(false);
    });

    return () => {
      client.end(true);
      console.log("🔌 MQTT desconectado del frontend");
    };
  }, []);

  // ================================
  // 🔁 FUNCION TOGGLE (BD + MQTT)
  // ================================
  const toggle = async () => {
    if (!psiculturaId) return;

    try {
      const nuevoEstado = !isOn;
      setBloqueado(true);

      const res = await cambiarEstado(psiculturaId, nuevoEstado, true);

      if (res.estado !== undefined) {
        setIsOn(Boolean(res.estado));
      }

      // 👉 publicar a MQTT
      const client = mqttClient();
      if (client) {
        client.publish(TOPIC, nuevoEstado ? "true" : "false");
        console.log("📤 enviado MQTT:", nuevoEstado);
      }

      setTimeout(() => setBloqueado(false), 3000);
    } catch (err) {
      console.error("❌ Error en toggle:", err);
      setBloqueado(false);
    }
  };

  // ================================
  // 🔄 REFRESCO PERIÓDICO BD
  // ================================
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (bloqueado || !psiculturaId) return;

        const estadoBD = await obtenerEstado(psiculturaId);

        if (estadoBD.estadoActual !== "automatico") return;

        setIsOn((prev) => {
          if (prev !== estadoBD.estado) return estadoBD.estado;
          return prev;
        });
      } catch (err) {
        console.error("Error refrescando estado", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [psiculturaId, bloqueado, obtenerEstado]);

  const userFullName = profile
    ? `${profile.primerNombre} ${profile.primerApellido}`
    : "Cargando...";

  return (
    <>
      <PageTitle>Piscicultura</PageTitle>

      {/* Tarjetas superiores */}
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

      {/* Botones superiores */}
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

      {/* Modal */}
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
          <ReportDownloader onClose={onOpenChange} userName={userFullName} />
        )}
      </CustomModal>

      {/* TOGGLE */}
      <div className="flex justify-center mt-10">
        <div
          onClick={toggle}
          className={`relative w-56 h-28 rounded-full cursor-pointer flex items-center select-none transition-colors duration-300 ${
            isOn ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <span
            className={`absolute text-white text-3xl font-extrabold tracking-wide z-20 transition-all duration-300 ${
              isOn ? "left-6" : "right-6"
            }`}
          >
            {isOn ? "ON" : "OFF"}
          </span>

          <div
            className={`absolute w-24 h-24 bg-white rounded-full shadow-2xl transition-all duration-300 z-10 ${
              isOn ? "translate-x-28" : "translate-x-2"
            }`}
          />
        </div>
      </div>

      <PisciculturaTable userName={userFullName} registros={registrosTabla} />
    </>
  );
}
