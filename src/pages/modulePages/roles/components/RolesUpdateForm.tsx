import ErrorMessage from "@/components/atoms/text/ErrorMessage";
import { iconsConfig } from "@/config/icons";
import useRol from "@/hooks/default/useRol";
import { Rol, RolSchema } from "@/types/modules/Rol";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import { useModalContext } from "@heroui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface props {
    selectedId: number;
    selectedData: Rol;
    setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
    setSelectedData: React.Dispatch<React.SetStateAction<Rol | null>>;
}

export default function RolesUpdateForm({selectedId, selectedData, setSelectedData, setSelectedId}: props){

    const { updateRol } = useRol();

    const { register, handleSubmit, formState: {errors}, watch } = useForm({
        resolver : zodResolver(RolSchema),
        defaultValues : {
            ...selectedData
        }
    });

    const { onClose } = useModalContext();

    async function onSubmit( data: Rol){
        await updateRol(selectedId,data);
        onClose();
        setSelectedData(null)
        setSelectedId(null)
    }

    async function handleCancel(){
        onClose();
        setSelectedData(null)
        setSelectedId(null)
    }

    return(
        <Form onSubmit={handleSubmit(onSubmit)}>

            <Input {...register("nombre")} label="Nombre" />
            {errors?.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}

            <Input {...register("descripcion")} label="Descripción" />
            {errors?.descripcion && <ErrorMessage>{errors.descripcion.message}</ErrorMessage>}

            <Select startContent={iconsConfig[watch("icono") as string]} {...register("icono")} label="Icono" labelPlacement="outside" >
                {Object.entries(iconsConfig).map(([key,Icon]) => (
                    <SelectItem startContent={Icon} key={key} >
                        {key}
                    </SelectItem>
                ))}
            </Select>
            {errors?.icono && <ErrorMessage>{errors.icono.message}</ErrorMessage>}

            <div className="flex ms-auto gap-4">
                <Button type="button" color="danger" variant="light" onPress={handleCancel}>
                    Cancelar
                </Button>

                <Button type="submit" color="success" className="text-white">
                    Actualizar
                </Button>
            </div>

        </Form>
    )
}