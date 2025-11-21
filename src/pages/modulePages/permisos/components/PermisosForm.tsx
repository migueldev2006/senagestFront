import ErrorMessage from "@/components/atoms/text/ErrorMessage";
import { iconsConfig, typeIcons } from "@/config/icons";
import usePermiso from "@/hooks/default/usePermiso";
import { Module } from "@/types/modules/Module";
import { Permiso, PermisoSchema } from "@/types/modules/Permiso";
import {
  Button,
  Form,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useModalContext } from "@heroui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import useRuta from "@/hooks/default/useRuta";
import { Ruta } from "@/types/modules/Ruta";

export default function PermisosForm() {
  const { createPermiso, modules } = usePermiso();
  const { getAllRutasByModule } = useRuta();

  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [rutas, setRutas] = useState<Ruta[] | null>(null);

  const { onClose } = useModalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(PermisoSchema),
    defaultValues: {
      tipo: "read",
    },
  });

  async function onSubmit(data: Permiso) {
    await createPermiso(data);
    onClose();
  }

  async function handleModuleSelection(e: ChangeEvent<HTMLSelectElement>) {
    const moduleId = parseInt(e.target.value);
    if (!isNaN(moduleId)) {
      setSelectedModule(moduleId);
      const rutas = await getAllRutasByModule(moduleId);
      setRutas(rutas);
    } else {
      setSelectedModule(null);
      setRutas(null);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {modules && (
        <Select
          startContent={
            iconsConfig[
              modules.find((module: Module) => module.id === selectedModule)
                ?.icono as string
            ] || ""
          }
          label="Modulo"
          onChange={handleModuleSelection}
        >
          {modules.map((module: Module) => (
            <SelectItem
              key={module.id}
              startContent={iconsConfig[module.icono]}
            >
              {module.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {rutas ? (
        <>
          <Select
            label="Rutas"
            {...register("rutaId")}
            onChange={(e) => setValue("rutaId", parseInt(e.target.value))}
          >
            {rutas.map((ruta: Ruta) => (
              <SelectItem key={ruta.id}>{ruta.nombre}</SelectItem>
            ))}
          </Select>
          {errors.rutaId && (
            <ErrorMessage>{errors.rutaId.message}</ErrorMessage>
          )}
          <Select
            startContent={typeIcons[watch("tipo")] || ""}
            {...register("tipo")}
            label="Tipo"
          >
            <SelectItem startContent={typeIcons["read"]} key={"read"}>
              Lectura
            </SelectItem>
            <SelectItem startContent={typeIcons["write"]} key={"write"}>
              Escritura
            </SelectItem>
            <SelectItem startContent={typeIcons["update"]} key={"update"}>
              Actualización
            </SelectItem>
            <SelectItem startContent={typeIcons["delete"]} key={"delete"}>
              Deshabilitación
            </SelectItem>
          </Select>
          {errors.tipo && <ErrorMessage>{errors.tipo.message}</ErrorMessage>}

          <Input {...register("nombre")} label="Nombre" />
          {errors.nombre && (
            <ErrorMessage>{errors.nombre.message}</ErrorMessage>
          )}

          <Textarea {...register("descripcion")} label="Descripción" />
          {errors.descripcion && (
            <ErrorMessage>{errors.descripcion.message}</ErrorMessage>
          )}
        </>
      ) : (
        <>
          {errors.rutaId && (
            <ErrorMessage>{errors.rutaId.message}</ErrorMessage>
          )}
        </>
      )}

      <div className="flex ms-auto gap-4">
        <Button type="button" color="danger" variant="light" onPress={onClose}>
          Cancelar
        </Button>

        <Button type="submit" color="success" className="text-white">
          Crear
        </Button>
      </div>
    </Form>
  );
}
