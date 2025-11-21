import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import SearchInput from "@/components/molecules/SearchInput";
import { iconsConfig, typeIcons } from "@/config/icons";
import usePermissions from "@/hooks/auth/usePermissions";
import usePermiso from "@/hooks/default/usePermiso";
import { Module } from "@/types/modules/Module";
import { PermisoUpdate } from "@/types/modules/Permiso";
import {
  Pagination,
  Select,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Pencil } from "lucide-react";

type Permiso = {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: boolean;
};

interface props {
  onOpen: () => void;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedData: React.Dispatch<React.SetStateAction<PermisoUpdate | null>>;
}

export default function PermisosTable({
  onOpen,
  setSelectedId,
  setSelectedData,
}: props) {
  const { hasPermission } = usePermissions();

  function handleEdit(permiso: PermisoUpdate & { id: number }) {
    setSelectedId(permiso.id);
    setSelectedData(permiso);
    onOpen();
  }

  const {
    moduleWithPermisos: modulo,
    isLoading,
    isError,
    error,
    setPage,
    totalPages,
    modules,
    selectedModule,
    setSelectedModule,
    updateStatus,
    setSearch
  } = usePermiso();

  return (
    <>
      <div className="flex gap-4 my-6 xl:w-1/2">
        {modules ? (
          <Select
            aria-label="moduleSelector"
            defaultSelectedKeys={[`${selectedModule}`]}
            onChange={(e) => setSelectedModule(parseInt(e.target.value))}
            startContent={
              iconsConfig[
                modules.find((module: Module) => module.id === selectedModule)
                  ?.icono as string
              ] || ""
            }
            placeholder="Seleccione..."
          >
            {modules.map((module: Module) => (
              <SelectItem
                key={module.id}
                startContent={iconsConfig[module.icono]}
              >
                {module.nombre}
              </SelectItem>
            ))}
          </Select>
        )
        :
        <LoadingSpinner/>
        }

        <Pagination
          onChange={(val) => setPage(val)}
          variant="bordered"
          color="success"
          showControls
          initialPage={1}
          total={totalPages}
        />
      </div>

      {isLoading && <LoadingSpinner/>}
      {isError && !isNaN(selectedModule) && <p>Error: {error?.message}</p>}

      {!isNaN(selectedModule) && (
        <>
          <div>
            <SearchInput setValue={setSearch}/>
            <Table aria-label={`TablaPermisos`}>
              <TableHeader>
                <TableColumn>Nombre</TableColumn>
                <TableColumn>Descripción</TableColumn>
                <TableColumn>
                  {(hasPermission(7) || hasPermission(8)) && <>Acciones</>}
                </TableColumn>
              </TableHeader>
              <TableBody>
                {modulo &&
                modulo.permisos?.length ? (
                  modulo.permisos.map((permiso: Permiso) => (
                    <TableRow key={permiso.id}>
                      <TableCell className="flex gap-2">
                        {typeIcons[permiso.tipo]}
                        {permiso.nombre}
                      </TableCell>
                      <TableCell>{permiso.descripcion}</TableCell>
                      <TableCell className="flex gap-2">
                        {hasPermission(7) && (
                          <Pencil
                            onClick={() => handleEdit(permiso)}
                            className="p-1 w-8 h-8 border-2 border-solid border-warning-500 rounded-lg text-warning-500 cursor-pointer"
                          />
                        )}
                        {hasPermission(8) &&
                          <Switch onChange={() => updateStatus(permiso.id)} color="success" defaultSelected={permiso.estado} />
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow key="no-permisos">
                    <TableCell colSpan={3}>
                      No hay permisos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}
