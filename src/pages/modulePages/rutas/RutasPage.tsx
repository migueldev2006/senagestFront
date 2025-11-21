import PageTitle from "@/components/atoms/PageTitle";
import RutasTable from "./components/RutasTable";
import usePermissions from "@/hooks/auth/usePermissions";
import { useDisclosure } from "@heroui/modal";
import CustomModal from "@/components/organisms/CustomModal";
import RutasForm from "./components/RutasForm";
import CustomButton from "@/components/atoms/CustomButton";
import { useState } from "react";
import { Ruta } from "@/types/modules/Ruta";
import RutasUpdateForm from "./components/RutasUpdateForm";

export default function RutasPage(){

    const {hasPermission} = usePermissions();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedData, setSelectedData] = useState<Ruta | null>(null);

    return(
        <>
            <PageTitle>Rutas</PageTitle>

            {hasPermission(18) && (
                <CustomButton
                    onPress={onOpen}
                >
                    + Crear Ruta
                </CustomButton>
            )}

            <CustomModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={selectedId ? "Editar ruta" : "Crear ruta"}
            >
                {selectedId && selectedData ?
                    <RutasUpdateForm selectedId={selectedId} selectedData={selectedData} setSelectedId={setSelectedId} setSelectedData={setSelectedData}/>
                    :
                    <RutasForm/>
                }
            </CustomModal>

            <RutasTable setSelectedId={setSelectedId} setSelectedData={setSelectedData} onOpen={onOpen}/>
        </>
    )
}