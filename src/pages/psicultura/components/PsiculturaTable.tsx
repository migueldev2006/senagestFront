import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

interface Props {
  registros: any[];
  userName: string;
}

export default function PisciculturaTable({ registros, userName }: Props) {
  return (
    <div className="mt-9">
      <h2 className="text-center font-bold mb-4">Historial Completo</h2>

      <Table aria-label="Tabla de historial de psicultura">
        <TableHeader>
          <TableColumn>Día</TableColumn>
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Hora</TableColumn>
          <TableColumn>Año</TableColumn>
          <TableColumn>Encendido por</TableColumn>
          <TableColumn>Apagado por</TableColumn>
          <TableColumn>Modo</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Tiempo Encendido</TableColumn>
          <TableColumn>Tiempo Apagado</TableColumn>
          <TableColumn>Tiempo Manual (s)</TableColumn>
          <TableColumn>Inicio</TableColumn>
          <TableColumn>Fin</TableColumn>
        </TableHeader>

        <TableBody>
          {registros.map((r, index) => {
            const fecha = new Date(r.fechaCreacion || r.inicio || new Date());

            return (
              <TableRow key={index}>
                <TableCell>{fecha.getDate()}</TableCell>

                <TableCell>{fecha.toISOString().split("T")[0]}</TableCell>

                <TableCell>
                  {fecha.toLocaleTimeString("es-CO", { hour12: true })}
                </TableCell>

                <TableCell>{fecha.getFullYear()}</TableCell>

                <TableCell>
                  {!r.inicio ? "Sistema" : (r.encendidoPor || userName || "N/A")}
                </TableCell>

                <TableCell>
                  {!r.inicio ? "Sistema" : (r.apagadoPor || userName || "N/A")}
                </TableCell>

                <TableCell>{r.modo || "auto"}</TableCell>

                <TableCell>{r.estado ? "Encendido" : "Apagado"}</TableCell>

                <TableCell>{r.tiempoEncendido || "00:00:00"}</TableCell>

                <TableCell>{r.tiempoApagado || "00:00:00"}</TableCell>

                <TableCell>
                  {r.tiempoMs ? Math.floor(r.tiempoMs / 1000) : "0"}
                </TableCell>

                <TableCell>
                  {r.inicio
                    ? new Date(r.inicio).toLocaleString("es-CO", {
                        hour12: true,
                      })
                    : "—"}
                </TableCell>

                <TableCell>
                  {r.fin
                    ? new Date(r.fin).toLocaleString("es-CO", { hour12: true })
                    : "En curso"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
