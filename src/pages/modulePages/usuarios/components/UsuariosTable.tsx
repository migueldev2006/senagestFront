import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import SearchInput from "@/components/molecules/SearchInput";
import usePermissions from "@/hooks/auth/usePermissions";
import useUsuario from "@/hooks/default/useUsuario";
import { Usuario as IncompleteUsuario, UsuarioUpdate } from "@/types/modules/Usuario";
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
import { format } from "date-fns";
import { Pencil } from "lucide-react";

type Usuario = IncompleteUsuario & {id: number, img: string};

interface props {
  onOpen: () => void;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedData: React.Dispatch<React.SetStateAction<UsuarioUpdate | null>>;
}

export default function UsuariosTable({
  onOpen,
  setSelectedId,
  setSelectedData,
}: props) {

  const { hasPermission } = usePermissions();
  const { users, isLoading, isError, error, setPage, totalPages, updateStatus, setSearch } = useUsuario();

  function handleEdit(usuario: Usuario ) {
    setSelectedId(usuario.id as number);
    setSelectedData(usuario);
    onOpen();
  }

  return (
    <>
      <SearchInput setValue={setSearch}/>
      <Table aria-label="UsuariosTable">
        <TableHeader>
          <TableColumn>Foto</TableColumn>
          <TableColumn>Identificación</TableColumn>
          <TableColumn>Nombre completo</TableColumn>
          <TableColumn>Correo</TableColumn>
          <TableColumn>Ficha</TableColumn>
          <TableColumn>Fecha de nacimiento</TableColumn>
          <TableColumn>
            {(hasPermission(16) || hasPermission(17)) && <>Acciones</>}
          </TableColumn>
        </TableHeader>
        <TableBody>
          {isLoading && (
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={7}><LoadingSpinner/></TableCell>
              </TableRow>
            ))
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={7}>Error: {error?.message}</TableCell>
            </TableRow>
          )}
          {users?.map((user: Usuario) => {
            const apiURL = import.meta.env.VITE_API_URL
            return(
              <TableRow key={user.id}>
                <TableCell><img src={`${apiURL}uploads/${user.img}`} alt="Foto de perfil" className="w-10 rounded-full aspect-square" /></TableCell>
                <TableCell>{user.identificacion}</TableCell>
                <TableCell>
                  {user.primerNombre} {user.segundoNombre ?? ""}{" "}
                  {user.primerApellido} {user.segundoApellido ?? ""}
                </TableCell>
                <TableCell>{user.correo}</TableCell>
                <TableCell>{user.fichaId}</TableCell>
                <TableCell>{format(user.fechaNacimiento, "dd/MM/yyyy")}</TableCell>
                <TableCell className="flex gap-2">
                  {hasPermission(16) && (
                    <Pencil
                      onClick={() => handleEdit({...user})}
                      className="p-1 w-8 h-8 border-2 border-solid border-warning-500 rounded-lg text-warning-500 cursor-pointer"
                    />
                  )}
                  {hasPermission(17) &&
                    <Switch onChange={() => updateStatus(user.id)} color="success" defaultSelected={user.estado} isDisabled={user.id === 1} />
                  }
                </TableCell>
              </TableRow>
          )})}
          
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
