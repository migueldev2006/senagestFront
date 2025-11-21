import PageTitle from "@/components/atoms/PageTitle";
import RolesTable from "./components/RolesTable";
import { useDisclosure } from "@heroui/modal";
import CustomModal from "@/components/organisms/CustomModal";
import RolesForm from "./components/RolesForm";
import usePermissions from "@/hooks/auth/usePermissions";
import { useState } from "react";
import RolesUpdateForm from "./components/RolesUpdateForm";
import { Rol } from "@/types/modules/Rol";
import CustomButton from "@/components/atoms/CustomButton";

export default function RolesPage() {
  const { hasPermission } = usePermissions();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<Rol | null>(null);

  return (
    <>
      <PageTitle>Roles</PageTitle>
      {hasPermission(10) && (
        <CustomButton
          onPress={onOpen}
        >
          + Crear Rol
        </CustomButton>
      )}

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={selectedId ? "Editar rol" : "Crear rol"}
      >
        {selectedId && selectedData ? (
          <RolesUpdateForm
            selectedId={selectedId}
            selectedData={selectedData}
            setSelectedId={setSelectedId}
            setSelectedData={setSelectedData}
          />
        ) : (
          <RolesForm />
        )}
      </CustomModal>

      <RolesTable setSelectedId={setSelectedId} setSelectedData={setSelectedData} onOpen={onOpen} />
    </>
  );
}
