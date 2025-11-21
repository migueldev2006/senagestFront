import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import SearchInput from "@/components/molecules/SearchInput";
import { iconsConfig } from "@/config/icons";
import usePermissions from "@/hooks/auth/usePermissions";
import useModulo from "@/hooks/default/useModulo";
import { Module } from "@/types/modules/Module";
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
  setSelectedData: React.Dispatch<React.SetStateAction<Module | null>>;
}

export default function ModulesTable({ onOpen, setSelectedId, setSelectedData }: props) {

  const { hasPermission } = usePermissions();
  const { modules, isLoading, isError, error, totalPages, setPage, updateStatus, setSearch } = useModulo();

  function handleEdit(module: Module & { id: number }) {
    setSelectedId(module.id);
    setSelectedData(module);
    onOpen();
  }

  return (
    <>
      <SearchInput setValue={setSearch} />
      <Table aria-label="ModulesTable">
        <TableHeader>
          <TableColumn>Ícono</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Descripción</TableColumn>
          <TableColumn>
            {(hasPermission(3) || hasPermission(4)) &&
              <>Acciones</>
            }
          </TableColumn>
        </TableHeader>
        <TableBody>
          {isLoading && (
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={4}><LoadingSpinner/></TableCell>
              </TableRow>
            ))
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={4}>Error: {error?.message}</TableCell>
            </TableRow>
          )}
          {modules?.map((module: Module & { id: number }, index: number) => (
            <TableRow key={index}>
              <TableCell>{iconsConfig[module.icono]}</TableCell>
              <TableCell>{module.nombre}</TableCell>
              <TableCell>{module.descripcion}</TableCell>
              <TableCell className="flex gap-2">
                {hasPermission(3) &&
                  <Pencil onClick={() => handleEdit(module)} className="p-1 w-8 h-8 border-2 border-solid border-warning-500 rounded-lg text-warning-500 cursor-pointer" />
                }
                {hasPermission(4) &&
                  <Switch onChange={() => updateStatus(module.id)} color="success" defaultSelected={module.estado} isDisabled={module.id === 1} />
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
