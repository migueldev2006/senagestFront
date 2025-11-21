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

interface props {
    selectedId: number;
    selectedData: Module;
    setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
    setSelectedData: React.Dispatch<React.SetStateAction<Module | null>>;
}

export default function ModulesUpdateForm({selectedId, selectedData, setSelectedData, setSelectedId}: props) {
  const { updateModule } = useModulo();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(ModuleSchema),
    defaultValues: {
      ...selectedData,
    },
  });

  const { onClose } = useModalContext();

  async function onSubmit(data: Module) {
    await updateModule(selectedId,data);
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
