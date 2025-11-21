import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import SearchInput from "@/components/molecules/SearchInput";
import { iconsConfig } from "@/config/icons";
import usePermissions from "@/hooks/auth/usePermissions";
import useRol from "@/hooks/default/useRol";
import { Rol } from "@/types/modules/Rol";
import {
  Pagination,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Pencil } from "lucide-react";

interface props {
  onOpen: () => void;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedData: React.Dispatch<React.SetStateAction<Rol | null>>;
}

export default function RolesTable({
  onOpen,
  setSelectedId,
  setSelectedData,
}: props) {
  const { hasPermission } = usePermissions();

  const { roles, isLoading, isError, error, totalPages, setPage, updateStatus, setSearch } = useRol();

  function handleEdit(rol: Rol) {
    setSelectedId(rol.id as number);
    setSelectedData(rol);
    onOpen();
  }

  return (
    <>
      <SearchInput setValue={setSearch} />
      <Table aria-label="TablaRoles">
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Descripción</TableColumn>
          <TableColumn>
            {(hasPermission(12) || hasPermission(13)) &&
              <>Acciones</>
            }
          </TableColumn>
        </TableHeader>
        <TableBody>
          {isLoading && (
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={3}><LoadingSpinner/></TableCell>
              </TableRow>
            ))
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={3}>Error: {error?.message}</TableCell>
            </TableRow>
          )}
          {roles?.map((rol: Rol & { id: number} ) => (
            <TableRow key={rol.id}>
              <TableCell className="flex">
                <span className="me-4">{iconsConfig[rol.icono]}</span>
                {rol.nombre}
              </TableCell>
              <TableCell>{rol.descripcion}</TableCell>
              <TableCell className="flex gap-2">
                {hasPermission(12) &&
                  <Pencil onClick={() => handleEdit(rol)} className="p-1 w-8 h-8 border-2 border-solid border-warning-500 rounded-lg text-warning-500 cursor-pointer" />
                }
                {hasPermission(13) &&
                  <Switch onChange={() => updateStatus(rol.id)} color="success" defaultSelected={rol.estado} />
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        onChange={(val) => setPage(val)}
        variant="bordered"
        color="success"
        showControls
        initialPage={1}
        total={totalPages}
        className="my-6"
      />
    </>
  );
}
