import { iconsConfig, typeIcons } from "@/config/icons";
import { Module } from "@/types/modules/Module";
import { Permiso, Rol } from "@/types/modules/Permiso";
import { Divider, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { Switch } from "@heroui/react";
import useRolPermiso from "@/hooks/default/useRolPermiso";

export default function PermisosMatrix() {
  const { roles, getPermisoByRol, asignPermiso } = useRolPermiso();

  const [selectedRole, setSelectedRole] = useState<number | undefined>(
    undefined
  );
  const [selectedModule, setSelectedModule] = useState<number | undefined>(
    undefined
  );

  const [modules, setModules] = useState<
    (Module & {
      id: number;
      permisos: (Permiso & { id: number; checked: boolean })[];
    })[]
  >([]);
  const [permisos, setPermisos] = useState<
    (Permiso & { id: number; checked: boolean })[]
  >([]);

  // GETS ROLE INFORMATION INCLUDING ITS PERMISOS

  async function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const rolId = parseInt(e.target.value);
    if (isNaN(rolId)) {
      setSelectedRole(undefined);
      setSelectedModule(undefined);
      setModules([]);
      setPermisos([]);
      return;
    }
    const response = await getPermisoByRol(rolId);
    setSelectedRole(rolId);
    setModules(response);
    setPermisos(
      response.find(
        (modulo: Module & { id: number }) => modulo.id === selectedModule
      )?.permisos || []
    );
  }

  // SETS PERMISOS VALUES

  async function handleModuleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const moduleId = parseInt(e.target.value);
    if (isNaN(moduleId)) {
      setSelectedModule(undefined);
      setPermisos([]);
      return;
    }
    setSelectedModule(moduleId);
    setPermisos(
      modules.find((modulo) => modulo.id === moduleId)?.permisos || []
    );
  }

  // UPDATES PERMISOS

  async function handleChecked(id: number, checked: boolean) {
    setPermisos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked } : p))
    );
    setModules((prev) =>
      prev.map((modulo) => ({
        ...modulo,
        permisos: modulo.permisos.map((p) =>
          p.id === id ? { ...p, checked } : p
        ),
      }))
    );
    if (!selectedRole) return console.log("No role selected");
    try {
      await asignPermiso(id, selectedRole, checked);
    } catch (error) {
      setPermisos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, checked: !checked } : p))
      );
      setModules((prev) =>
        prev.map((modulo) => ({
          ...modulo,
          permisos: modulo.permisos.map((p) =>
            p.id === id ? { ...p, checked: !checked } : p
          ),
        }))
      );
      console.log(error);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-4 my-6 sm:flex-row">
        <Select
          startContent={
            selectedRole
              ? iconsConfig[
                  roles?.find((rol: Rol) => rol.id === selectedRole)?.icono
                ]
              : ""
          }
          label="Roles"
          onChange={handleRoleChange}
          className="w-full sm:w-1/2 lg:w-1/3"
        >
          {roles?.map((rol: Rol) => (
            <SelectItem startContent={iconsConfig[rol.icono]} key={rol.id}>
              {rol.nombre}
            </SelectItem>
          ))}
        </Select>

        {modules.length > 0 && (
          <Select
            startContent={
              selectedModule
                ? iconsConfig[
                    modules?.find(
                      (modulo: Module & { id: number }) =>
                        modulo.id === selectedModule
                    )?.icono as string
                  ]
                : ""
            }
            label="Módulos"
            value={selectedModule}
            onChange={handleModuleChange}
            className="w-full sm:w-1/2 lg:w-1/3"
          >
            {modules.map((modulo) => (
              <SelectItem
                key={modulo.id}
                startContent={iconsConfig[modulo.icono]}
              >
                {modulo.nombre}
              </SelectItem>
            ))}
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-2">
        {permisos?.map((permiso) => (
          <div key={permiso.id}>
            <div className="flex min-h-12 justify-start items-center sm:border-2 sm:border-gray-300 sm:border-solid box-border px-2 rounded-xl">
              <span className="mr-2">{typeIcons[permiso.tipo]}</span>
              <p>{permiso.nombre}</p>
              <Switch
                color="success"
                onChange={(e) => handleChecked(permiso.id, e.target.checked)}
                isSelected={permiso.checked}
                className="ml-auto"
              />
            </div>
            <Divider className="my-2 sm:hidden" />
          </div>
        ))}
      </div>
    </div>
  );
}
