import ErrorMessage from "@/components/atoms/text/ErrorMessage";
import { iconsConfig } from "@/config/icons";
import useModulo from "@/hooks/default/useModulo";
import { Module, ModuleSchema } from "@/types/modules/Module";
import { useModalContext } from "@heroui/modal";
import {
  Button,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function ModulesForm() {
  const { createModule } = useModulo();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(ModuleSchema),
    defaultValues: {
      icono: "Book",
    },
  });

  const { onClose } = useModalContext();

  async function onSubmit(data: Module) {
    await createModule(data);
    onClose();
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("nombre")} label="Nombre" />
      {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}

      <Input {...register("descripcion")} label="Descripcion" />
      {errors.descripcion && (
        <ErrorMessage>{errors.descripcion.message}</ErrorMessage>
      )}

      <Select
        startContent={iconsConfig[watch("icono") as string]}
        {...register("icono")}
        label="Icono"
        labelPlacement="outside"
      >
        {Object.entries(iconsConfig).map(([key, Icon]) => (
          <SelectItem startContent={Icon} key={key}>
            {key}
          </SelectItem>
        ))}
      </Select>

      {errors.icono && <ErrorMessage>{errors.icono.message}</ErrorMessage>}

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
