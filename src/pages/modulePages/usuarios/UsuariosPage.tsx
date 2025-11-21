import PageTitle from "@/components/atoms/PageTitle";
import UsuariosTable from "./components/UsuariosTable";
import { useDisclosure } from "@heroui/modal";
import CustomModal from "@/components/organisms/CustomModal";
import UsuariosForm from "./components/UsuariosForm";
import usePermissions from "@/hooks/auth/usePermissions";
import CustomButton from "@/components/atoms/CustomButton";
import { useState } from "react";
import { UsuarioUpdate } from "@/types/modules/Usuario";
import UsuariosUpdateForm from "./components/UsuariosUpdateForm";

export default function UsuariosPage() {
  const { hasPermission } = usePermissions();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedData, setSelectedData] = useState<UsuarioUpdate | null>(null);

  return (
    <>
      <PageTitle>Usuarios</PageTitle>
      {hasPermission(14) && (
        <CustomButton
          onPress={onOpen}
        >
          + Crear Usuario
        </CustomButton>
      )}

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={selectedId ? "Editar usuario" : "Crear usuario"}
      >
        {selectedId && selectedData ?
          <UsuariosUpdateForm selectedId={selectedId} selectedData={selectedData} setSelectedId={setSelectedId} setSelectedData={setSelectedData}/>
            :                
          <UsuariosForm />
        }
      </CustomModal>

      <UsuariosTable setSelectedId={setSelectedId} setSelectedData={setSelectedData} onOpen={onOpen}/>
    </>
  );
}
