import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

interface Props {
  registros: any[];
    userName: string;

}

export default function PisciculturaTable({ registros,userName }: Props) {
  return (
    <div className="mt-9">
      <h2 className="text-center font-bold mb-4">Historial Completo</h2>

      <Table aria-label="Tabla de piscicultura">
        <TableHeader>
          <TableColumn>Día</TableColumn>
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Hora</TableColumn>
          <TableColumn>Año</TableColumn>
          <TableColumn>Encendido por</TableColumn>
          <TableColumn>Apagado por</TableColumn>
          <TableColumn>Tiempo Encendido</TableColumn>
          <TableColumn>Tiempo Apagado</TableColumn>
        </TableHeader>

        <TableBody>
          {registros.map((r, index) => {
            const fecha = new Date(r.fechaCreacion);

            return (
              <TableRow key={index}>
                <TableCell>{fecha.getDate()}</TableCell>
                <TableCell>{fecha.toISOString().split("T")[0]}</TableCell>
                <TableCell>
                  {fecha.toLocaleTimeString("es-CO", {
                    hour12: true,
                  })}
                </TableCell>
                <TableCell>{fecha.getFullYear()}</TableCell>
                <TableCell>{r.encendidoPor || userName }</TableCell>
                <TableCell>{r.apagadoPor || userName}</TableCell>
                <TableCell>{r.TiempoEncendido}</TableCell>
                <TableCell>{r.tiempoApagado}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
