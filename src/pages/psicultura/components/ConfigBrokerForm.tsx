import { usePiscicultura } from "@/hooks/default/usePsicultura"
import { Button, Form, Input } from "@heroui/react"
import { useState } from "react"
import { addToast } from "@heroui/toast"

export default function ConfigBrokerForm({ onClose }: { onClose: () => void }) {
  const { validarBroker, loading } = usePiscicultura()
  const [form, setForm] = useState({ url: "", usuario: "", contrasena: "" })
  const [errors, setErrors] = useState({ url: "", usuario: "", contrasena: "" })

  const validate = () => {
    const newErrors = {
      url: form.url.trim() ? "" : "La URL es obligatoria",
      usuario: form.usuario.trim() ? "" : "El usuario es obligatorio",
      contrasena: form.contrasena.trim() ? "" : "La contraseña es obligatoria"
    }
    setErrors(newErrors)
    return Object.values(newErrors).every(x => x === "")
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault()

    if (!validate()) {
      addToast({
        title: "Datos incompletos",
        description: "Debe completar todos los campos",
        color: "danger"
      })
      return
    }

    try {
      await validarBroker(form)
      addToast({
        title: "Broker validado",
        description: "La conexión fue realizada correctamente",
        color: "success"
      })
      onClose()
    } catch {
      addToast({
        title: "Error",
        description: "No se pudo validar el broker",
        color: "danger"
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        label="Url"
        isInvalid={!!errors.url}
        errorMessage={errors.url}
        onChange={(e) => {
          const v = e.target.value
          setForm({ ...form, url: v })
          setErrors({ ...errors, url: v.trim() ? "" : "La URL es obligatoria" })
        }}
      />

      <Input
        label="Usuario"
        isInvalid={!!errors.usuario}
        errorMessage={errors.usuario}
        onChange={(e) => {
          const v = e.target.value
          setForm({ ...form, usuario: v })
          setErrors({ ...errors, usuario: v.trim() ? "" : "El usuario es obligatorio" })
        }}
      />

      <Input
        label="Contraseña"
        type="password"
        isInvalid={!!errors.contrasena}
        errorMessage={errors.contrasena}
        onChange={(e) => {
          const v = e.target.value
          setForm({ ...form, contrasena: v })
          setErrors({ ...errors, contrasena: v.trim() ? "" : "La contraseña es obligatoria" })
        }}
      />

      <div className="flex ms-auto gap-4">
        <Button type="button" color="danger" variant="light" onPress={onClose}>
          Cancelar
        </Button>
        <Button type="submit" color="success" className="text-white" isLoading={loading}>
          Conectar
        </Button>
      </div>
    </Form>
  )
}
