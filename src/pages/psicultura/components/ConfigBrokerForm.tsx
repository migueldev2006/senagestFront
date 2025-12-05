import { usePiscicultura } from "@/hooks/default/usePsicultura"
import { Button, Form, Input } from "@heroui/react"
import { useState } from "react"
import { addToast } from "@heroui/toast"
import { connectBroker, disconnectBroker } from "@/broker/mqttClient"

export default function ConfigBrokerForm({ onClose }: { onClose: () => void }) {
  const { validarBroker, guardarConfigBroker, loading } = usePiscicultura()

  const [form, setForm] = useState({
    url: "",
    puerto: "",
    usuario: "",
    contrasena: ""
  })

  const [errors, setErrors] = useState({
    url: "",
    puerto: "",
    usuario: "",
    contrasena: ""
  })

  const validate = () => {
    const newErrors = {
      url: form.url.trim() ? "" : "La URL es obligatoria",
      puerto: form.puerto.trim() ? "" : "El puerto es obligatorio",
      usuario: form.usuario.trim() ? "" : "El usuario es obligatorio",
      contrasena: form.contrasena.trim() ? "" : "La contraseña es obligatoria",
    }

    setErrors(newErrors)
    return Object.values(newErrors).every(x => x === "")
  }

  // Construimos la URL final que usa MQTT por WebSocket
  const buildFinalUrl = () => {
    return `wss://${form.url}:${form.puerto}/mqtt`
  }

  // ---------------------------------------
  // 🔹 TESTEAR CONEXIÓN MANUAL DESDE FRONT
  // ---------------------------------------
  const handleTestConnection = () => {
    if (!validate()) {
      addToast({ title: "Datos incompletos", color: "danger" })
      return
    }

    const finalUrl = buildFinalUrl()

    try {
      disconnectBroker()

      const c = connectBroker({
        url: finalUrl,
        username: form.usuario,
        password: form.contrasena
      })

      c.on("connect", () => {
        addToast({ title: "Conexión exitosa", color: "success" })
        disconnectBroker()
      })

      c.on("error", () => {
        addToast({ title: "Error al conectar", color: "danger" })
        disconnectBroker()
      })

    } catch {
      addToast({ title: "Error inesperado", color: "danger" })
    }
  }

  // ---------------------------------------
  // 🔹 ENVIAR AL BACKEND Y GUARDAR EN BD
  // ---------------------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!validate()) {
      addToast({ title: "Datos incompletos", color: "danger" })
      return
    }

    const finalUrl = buildFinalUrl()

    try {
      // 1️⃣ validar broker en backend
      await validarBroker({
        url: finalUrl,
        usuario: form.usuario,
        contrasena: form.contrasena
      })

      // 2️⃣ guardar en la base de datos
      await guardarConfigBroker({
        url: form.url,
        port: form.puerto,
        username: form.usuario,
        password: form.contrasena
      })

      addToast({ title: "Configuración guardada correctamente", color: "success" })

      // 3️⃣ conectar broker desde frontend
      disconnectBroker()
      connectBroker({
        url: finalUrl,
        username: form.usuario,
        password: form.contrasena
      })

      onClose()

    } catch (err) {
      console.error(err)
      addToast({ title: "Error al guardar", color: "danger" })
    }
  }

  return (
    <Form onSubmit={handleSubmit}>

      <Input
        label="Host (sin protocolo)"
        placeholder="ej: 3f1876...hivemq.cloud"
        value={form.url}
        isInvalid={!!errors.url}
        errorMessage={errors.url}
        onChange={(e) => setForm({ ...form, url: e.target.value.trim() })}
      />

      <Input
        label="Puerto"
        type="number"
        placeholder="ej: 8884"
        value={form.puerto}
        isInvalid={!!errors.puerto}
        errorMessage={errors.puerto}
        onChange={(e) => setForm({ ...form, puerto: e.target.value.trim() })}
      />

      <Input
        label="Usuario"
        value={form.usuario}
        isInvalid={!!errors.usuario}
        errorMessage={errors.usuario}
        onChange={(e) => setForm({ ...form, usuario: e.target.value.trim() })}
      />

      <Input
        label="Contraseña"
        type="password"
        value={form.contrasena}
        isInvalid={!!errors.contrasena}
        errorMessage={errors.contrasena}
        onChange={(e) => setForm({ ...form, contrasena: e.target.value.trim() })}
      />

      <div className="flex ms-auto gap-4">
        <Button type="button" color="danger" variant="light" onPress={onClose}>
          Cancelar
        </Button>

        <Button type="button" color="default" variant="light" onPress={handleTestConnection}>
          Probar conexión
        </Button>

        <Button type="submit" color="success" className="text-white" isLoading={loading}>
          Conectar
        </Button>
      </div>

    </Form>
  )
}