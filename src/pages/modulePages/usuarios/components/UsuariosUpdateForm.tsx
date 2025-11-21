import { UsuarioUpdate, UsuarioUpdateSchema } from "@/types/modules/Usuario";
import ErrorMessage from "@/components/atoms/text/ErrorMessage";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { useModalContext } from "@heroui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useUsuarios from "@/hooks/default/useUsuario";
import useRol from "@/hooks/default/useRol";
import { Rol } from "@/types/modules/Rol";
import { iconsConfig } from "@/config/icons";

type Ficha = {
  codigo: number
}

interface props {
  selectedId: number;
  selectedData: UsuarioUpdate;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedData: React.Dispatch<React.SetStateAction<UsuarioUpdate | null>>;
}

export default function UsuariosUpdateForm({
  selectedId,
  selectedData,
  setSelectedData,
  setSelectedId,
}: props) {

  const { updateUser, fichas } = useUsuarios();
  const { allRoles } = useRol();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<UsuarioUpdate>({
    resolver: zodResolver(UsuarioUpdateSchema),
    defaultValues: {
      ...selectedData
    }
  });

  const { onClose } = useModalContext();

  const onSubmit = async (data: UsuarioUpdate) => {
    await updateUser(selectedId, data);
    onClose();
    setSelectedData(null);
    setSelectedId(null);
  };

  function handleCancel() {
    onClose();
    setSelectedData(null);
    setSelectedId(null);
  }

  const apiURL = import.meta.env.VITE_API_URL

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      {/* Imagen */}
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 my-3">
          <span className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-500 transition-all relative overflow-hidden bg-gray-50" >
            <img src={`${apiURL}uploads/${selectedData.img}`} alt="preview" className="object-cover w-full h-full rounded-full" />
          </span>
          {errors.img && <ErrorMessage>{String(errors.img.message)}</ErrorMessage>}
        </div>
      </div>

      <div className="flex w-full">
        <Input {...register("primerNombre")} label="Primer Nombre" />
        <Input {...register("segundoNombre")} label="Segundo Nombre (opcional)" />
      </div>
        {errors.primerNombre && <ErrorMessage>{errors.primerNombre.message}</ErrorMessage>}
        {errors.segundoNombre && <ErrorMessage>{errors.segundoNombre.message}</ErrorMessage>}

      <div className="flex w-full">
        <Input {...register("primerApellido")} label="Primer Apellido" />
        <Input {...register("segundoApellido")} label="Segundo Apellido (opcional)" />
      </div>
        {errors.primerApellido && <ErrorMessage>{errors.primerApellido.message}</ErrorMessage>}
        {errors.segundoApellido && <ErrorMessage>{errors.segundoApellido.message}</ErrorMessage>}

      {fichas &&
        <>
          <Select
            defaultSelectedKeys={selectedData.fichaId ? [`${selectedData.fichaId}`] : ["NULO"]}
            onChange={(e) => {
              const fichaId = parseInt(e.target.value);
              if (!isNaN(fichaId)) setValue("fichaId",fichaId)
              else setValue("fichaId",null)
            }}
            aria-label="ID Grupo"
            label="ID Grupo"
          >
            <SelectItem key={"NULO"}>Sin ficha</SelectItem>
            {fichas.map((ficha: Ficha) => (
              <SelectItem key={ficha.codigo.toString()}>{ficha.codigo.toString()}</SelectItem>
            ))}
          </Select>
          {errors.fichaId && <ErrorMessage>{errors.fichaId.message}</ErrorMessage>}
        </>
      }

      {allRoles &&
        <>
          <Select
            defaultSelectedKeys={selectedData.rolId ? [`${selectedData.rolId}`] : ["NULO"]}
            onChange={(e) => {
              const rolId = parseInt(e.target.value);
              if (!isNaN(rolId)) setValue("rolId",rolId)
              else setValue("rolId",null)
            }}
            startContent={watch("rolId") ? iconsConfig[allRoles.find((rol: Rol) => rol.id == watch("rolId")).icono] : iconsConfig["Ban"]}
            aria-label="Roles"
            label="Rol"
          >
            <SelectItem startContent={iconsConfig["Ban"]} key={"NULO"}>Sin rol</SelectItem>
            {allRoles.map((rol: Rol) => (
              <SelectItem startContent={iconsConfig[rol.icono]} key={rol.id}>{rol.nombre}</SelectItem>
            ))}
          </Select>
          {errors.rolId && <ErrorMessage>{errors.rolId.message}</ErrorMessage>}
        </>
      }

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
