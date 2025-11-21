import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import SearchInput from "@/components/molecules/SearchInput";
import { iconsConfig } from "@/config/icons";
import usePermissions from "@/hooks/auth/usePermissions";
import useRuta from "@/hooks/default/useRuta";
import { Module } from "@/types/modules/Module";
import { Ruta } from "@/types/modules/Ruta";
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

interface props {
  onOpen: () => void;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedData: React.Dispatch<React.SetStateAction<Ruta | null>>;
}

export default function PermisosTable({
  onOpen,
  setSelectedId,
  setSelectedData,
}: props) {
  const { hasPermission } = usePermissions();

  const {
    moduleWithRutas: modulo,
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
  } = useRuta();

  function handleEdit(ruta: Ruta) {
    setSelectedId(ruta.id as number);
    setSelectedData(ruta);
    onOpen();
  }

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
            <SearchInput setValue={setSearch} />
            <Table aria-label={`TablaRutas`}>
              <TableHeader>
                <TableColumn>Nombre</TableColumn>
                <TableColumn>Ruta</TableColumn>
                <TableColumn>
                  {(hasPermission(20) || hasPermission(21)) && <>Acciones</>}
                </TableColumn>
              </TableHeader>
              <TableBody>
                {modulo && modulo.rutas?.length ? (
                  modulo.rutas.map((ruta: Ruta & {id: number, estado: boolean}) => (
                    <TableRow key={ruta.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          {iconsConfig[modulo.icono]}
                          {ruta.nombre}
                        </div>
                      </TableCell>
                      <TableCell>
                        baseURL/{(modulo.nombre as string).toLowerCase()}/
                        {ruta.ruta}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {hasPermission(20) && (
                          <Pencil
                            onClick={() => handleEdit({...ruta, moduloId: modulo.id})}
                            className="p-1 w-8 h-8 border-2 border-solid border-warning-500 rounded-lg text-warning-500 cursor-pointer"
                          />
                        )}
                        {hasPermission(21) &&
                          <Switch onChange={() => updateStatus(ruta.id)} color="success" defaultSelected={ruta.estado} />
                        }
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow key="no-permisos">
                    <TableCell colSpan={3}>No hay rutas disponibles</TableCell>
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
