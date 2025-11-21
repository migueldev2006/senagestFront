import PageTitle from "@/components/atoms/PageTitle";
import PermisosTable from "./components/PermisosTable";
import { useDisclosure } from "@heroui/modal";
import CustomModal from "@/components/organisms/CustomModal";
import PermisosForm from "./components/PermisosForm";
import usePermissions from "@/hooks/auth/usePermissions";
import { PermisoUpdate } from "@/types/modules/Permiso";
import { useState } from "react";
import PermisosUpdateForm from "./components/PermisosUpdateForm";
import CustomButton from "@/components/atoms/CustomButton";

export default function PermisosPage() {
  const { hasPermission } = usePermissions();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedData, setSelectedData] = useState<PermisoUpdate | null>(null);

  return (
    <>
      <PageTitle>Permisos</PageTitle>

      {hasPermission(5) && (
        <CustomButton
          onPress={onOpen}
        >
          + Crear Permiso
        </CustomButton>
      )}

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={selectedId ? "Editar permiso" : "Crear permiso"}
      >
        {selectedId && selectedData ? 
          <PermisosUpdateForm selectedId={selectedId} selectedData={selectedData} setSelectedId={setSelectedId} setSelectedData={setSelectedData}/>
            :
          <PermisosForm />
        }
      </CustomModal>

      <PermisosTable setSelectedData={setSelectedData} setSelectedId={setSelectedId} onOpen={onOpen} />
    </>
  );
}
