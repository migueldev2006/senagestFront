import ErrorMessage from "@/components/atoms/text/ErrorMessage";
import { typeIcons } from "@/config/icons";
import usePermiso from "@/hooks/default/usePermiso";
import { PermisoUpdate, PermisoUpdateSchema } from "@/types/modules/Permiso";
import { useModalContext } from "@heroui/modal";
import { Button, Form, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface props {
    selectedId: number;
    selectedData: PermisoUpdate;
    setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
    setSelectedData: React.Dispatch<React.SetStateAction<PermisoUpdate | null>>;
}

export default function PermisosUpdateForm({selectedId, selectedData, setSelectedData, setSelectedId}: props) {
  const { updatePermiso } = usePermiso();

  const { onClose } = useModalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(PermisoUpdateSchema),
    defaultValues: {
      ...selectedData
    }
  });

  async function onSubmit(data: PermisoUpdate) {
    await updatePermiso(selectedId, data);
    onClose();
    setSelectedId(null);
    setSelectedData(null);
  }

function handleCancel(){
    onClose();
    setSelectedId(null);
    setSelectedData(null);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
      {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}

      <Textarea {...register("descripcion")} label="Descripción" />
      {errors.descripcion && (
        <ErrorMessage>{errors.descripcion.message}</ErrorMessage>
      )}
      <div className="flex ms-auto gap-4">
        <Button type="button" color="danger" variant="light" onPress={handleCancel}>
          Cancelar
        </Button>

        <Button type="submit" color="success" className="text-white">
          Actualizar
        </Button>
      </div>
    </Form>
  );
}
