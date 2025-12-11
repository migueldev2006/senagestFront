import { usePiscicultura } from "@/hooks/default/usePsicultura";
import {
  Button,
  Form,
  Input,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { addToast } from "@heroui/toast";
import { disconnectBroker } from "@/broker/mqttClient";
import { useDisclosure } from "@heroui/modal";
import CustomModal from "@/components/organisms/CustomModal";
import { axiosAPI } from "@/api/axiosAPI";

export default function ConfigBrokerForm() {
  const {
    validarBroker,
    guardarConfigBroker,
    obtenerConfigsBroker,
    actualizarConfigBroker,
    loading,
  } = usePiscicultura();
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onOpenChange: onFormOpenChange,
  } = useDisclosure();

  const [form, setForm] = useState({
    name: "",
    url: "",
    puerto: "",
    protocolo: "mqtt" as "mqtt" | "mqtts" | "ws" | "wss",
    usuario: "",
    contrasena: "",
    base_topic: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    url: "",
    puerto: "",
    protocolo: "",
    usuario: "",
    contrasena: "",
    base_topic: "",
  });

  const [configs, setConfigs] = useState<any[]>([]);

  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [activeAction, setActiveAction] = useState<{
    [key: number]: "publish" | "subscribe" | null;
  }>({});
  const [lastPublished, setLastPublished] = useState<{ [key: number]: string }>(
    {}
  );
  const [subscribedTopics, setSubscribedTopics] = useState<{
    [key: number]: string;
  }>({});
  const [editForm, setEditForm] = useState({
    name: "",
    url: "",
    puerto: "",
    protocolo: "mqtt" as "mqtt" | "mqtts" | "ws" | "wss",
    usuario: "",
    contrasena: "",
    base_topic: "",
  });

  // Cargar configuraciones al montar el componente
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const data = await obtenerConfigsBroker();
        setConfigs(data);
      } catch (err) {
        console.error("Error cargando configuraciones:", err);
      }
    };
    loadConfigs();

    // Cargar estados persistentes
    const savedPublished = localStorage.getItem("lastPublished");
    if (savedPublished) setLastPublished(JSON.parse(savedPublished));

    const savedSubscribed = localStorage.getItem("subscribedTopics");
    if (savedSubscribed) setSubscribedTopics(JSON.parse(savedSubscribed));
  }, [obtenerConfigsBroker]);

  // Persistir lastPublished
  useEffect(() => {
    localStorage.setItem("lastPublished", JSON.stringify(lastPublished));
  }, [lastPublished]);

  // Persistir subscribedTopics
  useEffect(() => {
    localStorage.setItem("subscribedTopics", JSON.stringify(subscribedTopics));
  }, [subscribedTopics]);

  const validate = () => {
    const newErrors = {
      name: form.name.trim() ? "" : "El nombre es obligatorio",
      url: form.url.trim() ? "" : "La URL es obligatoria",
      puerto: form.puerto.trim() ? "" : "El puerto es obligatorio",
      protocolo: "",
      usuario: "",
      contrasena: "",
      base_topic: form.base_topic.trim() ? "" : "El topic es obligatorio",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((x) => x === "");
  };

  // Construimos la URL final según el protocolo
  const buildFinalUrl = (config: {
    url: string;
    port: string | number;
    protocol: "mqtt" | "mqtts" | "ws" | "wss";
  }) => {
    if (!config.port) throw new Error("Puerto no proporcionado");
    const puerto = String(config.port).trim();
    if (!puerto) throw new Error("Puerto inválido");

    if (config.protocol === "mqtt") {
      return `mqtt://${config.url}:${puerto}`;
    } else if (config.protocol === "mqtts") {
      return `mqtts://${config.url}:${puerto}`;
    } else if (config.protocol === "ws") {
      return `ws://${config.url}:${puerto}/mqtt`;
    } else if (config.protocol === "wss") {
      return `wss://${config.url}:${puerto}/mqtt`;
    } else {
      throw new Error("Protocolo no soportado");
    }
  };

  // ---------------------------------------
  // 🔹 TESTEAR CONEXIÓN MANUAL DESDE FRONT
  // ---------------------------------------
  const handleTestConnection = async () => {
    if (!validate()) {
      addToast({ title: "Datos incompletos", color: "danger" });
      return;
    }

    try {
      const response = await axiosAPI.post(
        "/psicultura/broker/config/test-connection/1",
        {
          name: form.name,
          url: form.url,
          port: parseInt(form.puerto),
          protocol: form.protocolo,
          username: form.usuario,
          password: form.contrasena,
          base_topic: form.base_topic,
        }
      );

      if (response.data.ok) {
        addToast({ title: "Conexión exitosa", color: "success" });
      } else {
        addToast({ title: response.data.message, color: "danger" });
      }
    } catch (error) {
      addToast({ title: "Error al probar conexión", color: "danger" });
    }
  };

  // ---------------------------------------
  // 🔹 FUNCIONES PARA CONFIGURACIONES EXISTENTES
  // ---------------------------------------
  const handleTestConnectionConfig = async (config: any) => {
    try {
      const response = await axiosAPI.post(
        `/psicultura/broker/config/test-connection/${config.id}`
      );
      if (response.data.ok) {
        addToast({ title: "Conexión exitosa", color: "success" });
      } else {
        addToast({ title: response.data.message, color: "danger" });
      }
    } catch (error) {
      addToast({ title: "Error al probar conexión", color: "danger" });
    }
  };

  const handlePublishConfig = async (config: any) => {
    // Si ya está suscrito, no permitir publicar
    if (activeAction[config.id] === "subscribe") {
      addToast({
        title: "Debe cancelar la suscripción antes de publicar",
        color: "warning",
      });
      return;
    }

    setActiveAction((prev) => ({ ...prev, [config.id]: "publish" }));

    // Desconectar cualquier conexión frontend previa
    disconnectBroker();

    try {
      const response = await axiosAPI.post(
        `/psicultura/broker/config/publish/${config.id}`,
        {
          topic: "set",
          message: "Mensaje de prueba",
        }
      );
      if (response.data.ok) {
        addToast({ title: "Mensaje publicado", color: "success" });
        setLastPublished((prev) => ({
          ...prev,
          [config.id]: config.base_topic,
        }));
      } else {
        addToast({ title: response.data.message, color: "danger" });
      }
    } catch (error) {
      addToast({ title: "Error al publicar", color: "danger" });
    }
    setActiveAction((prev) => ({ ...prev, [config.id]: null }));
  };

  const handleSubscribeConfig = async (config: any) => {
    // Si ya está publicando, no permitir suscribirse
    if (activeAction[config.id] === "publish") {
      addToast({
        title: "Debe esperar a que termine la publicación antes de suscribirse",
        color: "warning",
      });
      return;
    }

    setActiveAction((prev) => ({ ...prev, [config.id]: "subscribe" }));

    try {
      const response = await axiosAPI.post(
        `/psicultura/broker/config/subscribe/${config.id}`
      );
      if (response.data.ok) {
        addToast({ title: "Suscripción exitosa", color: "success" });
        setSubscribedTopics((prev) => ({
          ...prev,
          [config.id]: config.base_topic,
        }));
        // Mantener la suscripción activa hasta que se cancele
      } else {
        addToast({ title: response.data.message, color: "danger" });
        setActiveAction((prev) => ({ ...prev, [config.id]: null }));
      }
    } catch (error) {
      addToast({ title: "Error al suscribirse", color: "danger" });
      setActiveAction((prev) => ({ ...prev, [config.id]: null }));
    }
  };

  const handleCancelConfig = async (config: any) => {
    try {
      await axiosAPI.post(`/psicultura/broker/config/disconnect/${config.id}`);
      addToast({ title: "Conexión cancelada en backend", color: "warning" });
    } catch (error) {
      console.error("Error desconectando del backend:", error);
      addToast({ title: "Error al desconectar del backend", color: "danger" });
    }
    disconnectBroker();
    addToast({ title: "Conexión cancelada en frontend", color: "warning" });

    // Resetear la acción activa y limpiar estados
    setActiveAction((prev) => ({ ...prev, [config.id]: null }));
    setSubscribedTopics((prev) => {
      const newState = { ...prev };
      delete newState[config.id];
      return newState;
    });
  };

  const handleEditConfig = (config: any) => {
    setEditingConfig(config);
    setEditForm({
      name: config.name || "",
      url: config.url,
      puerto: String(config.port),
      protocolo: config.protocol || "mqtt",
      usuario: config.username,
      contrasena: config.password,
      base_topic: config.base_topic || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingConfig) return;

    try {
      await actualizarConfigBroker(editingConfig.id, {
        name: editForm.name,
        url: editForm.url,
        port: Number(editForm.puerto),
        protocol: editForm.protocolo,
        username: editForm.usuario,
        password: editForm.contrasena,
        base_topic: editForm.base_topic,
      });
      addToast({ title: "Configuración actualizada", color: "success" });
      setEditingConfig(null);
      const updatedConfigs = await obtenerConfigsBroker();
      setConfigs(updatedConfigs);
    } catch (err) {
      console.error(err);
      addToast({ title: "Error al actualizar", color: "danger" });
    }
  };

  // ---------------------------------------
  // 🔹 ENVIAR AL BACKEND Y GUARDAR EN BD
  // ---------------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) {
      addToast({ title: "Datos incompletos", color: "danger" });
      return;
    }

    const finalUrl = buildFinalUrl({
      url: form.url,
      port: form.puerto,
      protocol: form.protocolo,
    });

    try {
      // 1️⃣ validar broker en backend
      await validarBroker({
        url: finalUrl,
        usuario: form.usuario,
        contrasena: form.contrasena,
      });

      // 2️⃣ guardar en la base de datos
      await guardarConfigBroker({
        name: form.name,
        url: form.url,
        port: form.puerto,
        protocol: form.protocolo,
        username: form.usuario,
        password: form.contrasena,
        base_topic: form.base_topic,
      });

      addToast({
        title: "Configuración guardada correctamente",
        color: "success",
      });

      // 3️⃣ recargar lista de configuraciones
      const updatedConfigs = await obtenerConfigsBroker();
      setConfigs(updatedConfigs);

      // 4️⃣ resetear formulario y ocultar
      setForm({
        name: "",
        url: "",
        puerto: "",
        protocolo: "mqtt",
        usuario: "",
        contrasena: "",
        base_topic: "",
      });
      onFormOpenChange();
    } catch (err) {
      console.error(err);
      addToast({ title: "Error al guardar", color: "danger" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Lista de configuraciones existentes */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Configuraciones Guardadas</h3>
        </CardHeader>
        <CardBody>
          {configs.length === 0 ? (
            <p className="text-gray-500">No hay configuraciones guardadas</p>
          ) : (
            <div className="grid gap-4">
              {configs.map((config, index) => (
                <Card
                  key={index}
                  className={`border ${config.active ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                >
                  <CardBody>
                    <h1 className="text-center">
                      <strong>Nombre</strong> {config.name}
                    </h1>
                    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
                      <div>
                        <strong>URL:</strong> {config.url}
                      </div>
                      <div>
                        <strong>Puerto:</strong> {config.port}
                      </div>
                      <div>
                        <strong>Usuario:</strong> {config.username}
                      </div>
                      <div>
                        <strong>Topic Base:</strong> {config.base_topic}
                      </div>
                      <div>
                        <strong>Protocolo:</strong> {config.protocol}
                      </div>
                      {config.subscribed_topics &&
                        config.subscribed_topics.length > 0 && (
                          <div>
                            <strong>📡 Suscrito a:</strong>{" "}
                            {config.subscribed_topics.join(", ")}
                          </div>
                        )}
                      {config.published_topics &&
                        config.published_topics.length > 0 && (
                          <div>
                            <strong>📤 Publicando en:</strong>{" "}
                            {config.published_topics.join(", ")}
                          </div>
                        )}
                    </div>
                    {config.active && (
                      <div className="mt-2 text-green-600 font-semibold">
                        ✓ Configuración Activa
                      </div>
                    )}
                    {activeAction[config.id] && (
                      <div className="mt-2 text-blue-600 font-semibold">
                        {activeAction[config.id] === "publish"
                          ? "📤 Publicando..."
                          : "📡 Suscrito"}
                      </div>
                    )}
                    {subscribedTopics[config.id] && (
                      <div className="mt-2 text-green-600 font-semibold">
                        📡 Suscrito a: {subscribedTopics[config.id]}
                      </div>
                    )}
                    {lastPublished[config.id] && !activeAction[config.id] && (
                      <div className="mt-2 text-purple-600 font-semibold">
                        📤 Último publicado en: {lastPublished[config.id]}
                      </div>
                    )}
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => handleTestConnectionConfig(config)}
                      >
                        Probar Conexión
                      </Button>
                      <Button
                        size="sm"
                        color="secondary"
                        onPress={() => handlePublishConfig(config)}
                        isDisabled={activeAction[config.id] === "subscribe"}
                      >
                        Publicar
                      </Button>
                      {activeAction[config.id] === "subscribe" ? (
                        <Button
                          size="sm"
                          color="danger"
                          onPress={() => handleCancelConfig(config)}
                        >
                          Desuscribirse
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          color="warning"
                          onPress={() => handleSubscribeConfig(config)}
                          isDisabled={activeAction[config.id] === "publish"}
                        >
                          Suscribirse
                        </Button>
                      )}
                      <Button
                        size="sm"
                        color="secondary"
                        onPress={() => handleEditConfig(config)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        color="default"
                        onPress={() => handleCancelConfig(config)}
                        isDisabled={activeAction[config.id] !== null}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Botón para agregar nueva configuración */}
      <div className="flex justify-center">
        <Button color="primary" onPress={onFormOpen} className="text-white">
          Agregar Nueva Configuración
        </Button>
      </div>

      {/* Modal para editar configuración */}
      <CustomModal
        title="Editar Configuración"
        isOpen={!!editingConfig}
        onOpenChange={() => setEditingConfig(null)}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveEdit();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Host (sin protocolo)"
              placeholder="ej: 3f187645294a400cbe2d87a2ec16ec53.s1.eu.hivemq.cloud"
              value={editForm.url}
              onChange={(e) =>
                setEditForm({ ...editForm, url: e.target.value.trim() })
              }
            />

            <Input
              label="Puerto"
              type="number"
              placeholder="ej: 8883 o 8884"
              value={editForm.puerto}
              onChange={(e) =>
                setEditForm({ ...editForm, puerto: e.target.value.trim() })
              }
            />

            <Input
              label="Usuario (opcional)"
              value={editForm.usuario}
              onChange={(e) =>
                setEditForm({ ...editForm, usuario: e.target.value.trim() })
              }
            />

            <Input
              label="Contraseña (opcional)"
              type="password"
              value={editForm.contrasena}
              onChange={(e) =>
                setEditForm({ ...editForm, contrasena: e.target.value.trim() })
              }
            />

            <Input
              label="Topic Base"
              value={editForm.base_topic}
              onChange={(e) =>
                setEditForm({ ...editForm, base_topic: e.target.value.trim() })
              }
              className="md:col-span-2"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              color="danger"
              variant="light"
              onPress={() => setEditingConfig(null)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              color="success"
              className="text-white"
              isLoading={loading}
            >
              Guardar Cambios
            </Button>
          </div>
        </Form>
      </CustomModal>

      {/* Modal para el formulario */}
      <CustomModal
        title="Nueva Configuración"
        isOpen={isFormOpen}
        onOpenChange={onFormOpenChange}
      >
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              placeholder="ej: Configuración Principal"
              value={form.name}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value.trim() })
              }
            />

            <Input
              label="Host (sin protocolo)"
              placeholder="ej: 3f187645294a400cbe2d87a2ec16ec53.s1.eu.hivemq.cloud"
              value={form.url}
              isInvalid={!!errors.url}
              errorMessage={errors.url}
              onChange={(e) => setForm({ ...form, url: e.target.value.trim() })}
            />

            <Input
              label="Puerto"
              type="number"
              placeholder="ej: 8883 o 8884"
              value={form.puerto}
              isInvalid={!!errors.puerto}
              errorMessage={errors.puerto}
              onChange={(e) =>
                setForm({ ...form, puerto: e.target.value.trim() })
              }
            />

            <Select
              label="Protocolo"
              placeholder="Selecciona el protocolo"
              selectedKeys={[form.protocolo]}
              onSelectionChange={(keys) =>
                setForm({
                  ...form,
                  protocolo: Array.from(keys)[0] as
                    | "mqtt"
                    | "mqtts"
                    | "ws"
                    | "wss",
                })
              }
            >
              <SelectItem key="mqtt">MQTT</SelectItem>
              <SelectItem key="mqtts">MQTT (TLS)</SelectItem>
              <SelectItem key="ws">WebSockets</SelectItem>
              <SelectItem key="wss">WebSockets (TLS)</SelectItem>
            </Select>

            <Input
              label="Usuario"
              value={form.usuario}
              isInvalid={!!errors.usuario}
              errorMessage={errors.usuario}
              onChange={(e) =>
                setForm({ ...form, usuario: e.target.value.trim() })
              }
            />

            <Input
              label="Contraseña"
              type="password"
              value={form.contrasena}
              isInvalid={!!errors.contrasena}
              errorMessage={errors.contrasena}
              onChange={(e) =>
                setForm({ ...form, contrasena: e.target.value.trim() })
              }
            />

            <Input
              label="Topic Base"
              value={form.base_topic}
              isInvalid={!!errors.base_topic}
              errorMessage={errors.base_topic}
              onChange={(e) =>
                setForm({ ...form, base_topic: e.target.value.trim() })
              }
              className="md:col-span-2"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              color="danger"
              variant="light"
              onPress={() => onFormOpenChange()}
            >
              Cerrar Modal
            </Button>

            <Button
              type="button"
              color="default"
              variant="light"
              onPress={handleTestConnection}
            >
              Probar conexión
            </Button>

            <Button
              type="submit"
              color="success"
              className="text-white"
              isLoading={loading}
            >
              Guardar y Conectar
            </Button>
          </div>
        </Form>
      </CustomModal>
    </div>
  );
}
