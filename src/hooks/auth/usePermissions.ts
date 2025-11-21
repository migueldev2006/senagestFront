import { AuthData } from "@/providers/AuthProvider";

export default function usePermissions() {

  const { appLoading, permissions } = AuthData();

  function hasPermission(id: number) {

    // Aún no han cargado los permisos → no bloquear
    if (appLoading) return true;

    // Si no hay permisos cargados aún → permitir temporalmente
    if (!permissions || permissions.length === 0) return true;

    return permissions.some((permiso) => permiso.id === id);
  }

  return { hasPermission };
}
