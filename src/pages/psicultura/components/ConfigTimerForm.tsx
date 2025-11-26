import { usePiscicultura } from "@/hooks/default/usePsicultura";
import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";
import { addToast } from "@heroui/toast"


export default function ConfigTimerForm({ onClose }: { onClose: () => void }) {
  const { actualizarTimer, loading } = usePiscicultura();
  const [form, setForm] = useState({ TiempoEncendido: "", tiempoApagado: "" });
  const [errors, setErrors] = useState({ TiempoEncendido: "", tiempoApagado: "" })
const regexInterval = /^([0-9]{2}):([0-5][0-9]):([0-5][0-9])$/

  const validate = () => {
    const newErrors = {
      TiempoEncendido: regexInterval.test(form.TiempoEncendido) ? "" : "Formato HH:MM:SS",
      tiempoApagado: regexInterval.test(form.tiempoApagado) ? "" : "Formato HH:MM:SS"
    }
    setErrors(newErrors)
    return Object.values(newErrors).every(x => x === "")
  }
const handleSubmit = async (e:any) => {
  e.preventDefault()

  if (!validate()) {
    addToast({
      title: "Datos incompletos",
      description: "Debe completar los campos en formato HH:MM:SS",
      color: "danger"
    })
    return
  }

  try {
    await actualizarTimer(1, form)
    addToast({
      title: "Timer actualizado",
      description: "La configuración fue guardada correctamente",
      color: "success"
    })
    onClose()
  } catch {
    addToast({
      title: "Error",
      description: "No se pudo actualizar el timer",
      color: "danger"
    })
  }
}


  return (
<Form onSubmit={handleSubmit}>
      <Input
  label="Tiempo Encendido (HH:MM:SS)"
  placeholder="00:10:00"
  isInvalid={!!errors.TiempoEncendido}
  errorMessage={errors.TiempoEncendido}
  onChange={(e) => {
    const value = e.target.value
    setForm({ ...form, TiempoEncendido: value })
    setErrors({
      ...errors,
      TiempoEncendido: regexInterval.test(value) ? "" : "Formato HH:MM:SS"
    })
  }}
/>

<Input
  label="Tiempo Apagado (HH:MM:SS)"
  placeholder="00:05:00"
  isInvalid={!!errors.tiempoApagado}
  errorMessage={errors.tiempoApagado}
  onChange={(e) => {
    const value = e.target.value
    setForm({ ...form, tiempoApagado: value })
    setErrors({
      ...errors,
      tiempoApagado: regexInterval.test(value) ? "" : "Formato HH:MM:SS"
    })
  }}
/>


      <div className="flex ms-auto gap-4">
        <Button type="button" color="danger" variant="light" onPress={onClose}>Cancelar</Button>
        <Button type="submit" color="success" className="text-white" isLoading={loading}>Aplicar</Button>
      </div>
    </Form>
  );
}
