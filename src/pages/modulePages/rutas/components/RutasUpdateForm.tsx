import useRuta from "@/hooks/default/useRuta";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { useModalContext } from "@heroui/modal";
import { Ruta, RutaSchema } from "@/types/modules/Ruta";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/atoms/text/ErrorMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { iconsConfig } from "@/config/icons";

interface props {
  selectedId: number;
  selectedData: Ruta;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedData: React.Dispatch<React.SetStateAction<Ruta | null>>;
}

export default function RutasUpdateForm({
  selectedId,
  selectedData,
  setSelectedData,
  setSelectedId,
}: props) {
  const { updateRuta, modules } = useRuta();

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
      ...selectedData,
    },
  });

  async function onSubmit(data: Ruta) {
    await updateRuta(selectedId, data);
    onClose();
    setSelectedData(null);
    setSelectedId(null);
  }

  function handleCancel() {
    onClose();
    setSelectedData(null);
    setSelectedId(null);
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
          {errors.moduloId && (
            <ErrorMessage>{errors.moduloId.message}</ErrorMessage>
          )}
        </>
      )}

      <Input {...register("nombre")} label="Nombre" />
      {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}

      <Input {...register("ruta")} label="Ruta" />
      {errors.ruta && <ErrorMessage>{errors.ruta.message}</ErrorMessage>}

      <div className="flex ms-auto gap-4">
        <Button
          type="button"
          color="danger"
          variant="light"
          onPress={handleCancel}
        >
          Cancelar
        </Button>

        <Button type="submit" color="success" className="text-white">
          Actualizar
        </Button>
      </div>
    </Form>
  );
}
