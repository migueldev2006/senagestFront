import useRuta from "@/hooks/default/useRuta";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { useModalContext } from "@heroui/modal";
import { Ruta, RutaSchema } from "@/types/modules/Ruta";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/atoms/text/ErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { iconsConfig } from "@/config/icons";

export default function RutasForm() {
  const { createRuta, modules } = useRuta();

  const { onClose } = useModalContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(RutaSchema),
    defaultValues: {
      moduloId: 1,
    },
  });

  async function onSubmit(data: Ruta) {
    await createRuta(data);
    onClose();
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {modules && (
        <>
        <Select
          {...register("moduloId")}
          onChange={(e) => setValue("moduloId", parseInt(e.target.value))}
          startContent={
            iconsConfig[
              modules.find((module: any) => module.id === watch("moduloId"))
                ?.icono || ""
            ]
          }
          label="Modulo"
        >
          {modules.map((module: any) => (
            <SelectItem
              key={module.id}
              startContent={iconsConfig[module.icono]}
            >
              {module.nombre}
            </SelectItem>
          ))}
        </Select>
        {errors.moduloId && <ErrorMessage>{errors.moduloId.message}</ErrorMessage>}
        </>
      )}

      <Input {...register("nombre")} label="Nombre" />
      {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}

      <Input {...register("ruta")} label="Ruta" />
      {errors.ruta && <ErrorMessage>{errors.ruta.message}</ErrorMessage>}

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
