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
                {/* Día */}
                <TableCell>{fecha.getDate()}</TableCell>

                {/* Fecha */}
                <TableCell>{fecha.toISOString().split("T")[0]}</TableCell>

                {/* Hora */}
                <TableCell>
                  {fecha.toLocaleTimeString("es-CO", { hour12: true })}
                </TableCell>

                {/* Año */}
                <TableCell>{fecha.getFullYear()}</TableCell>

                {/* Encendido por */}
                <TableCell>
                  {!r.inicio ? "Sistema" : (r.encendidoPor || userName || "N/A")}
                </TableCell>

                {/* Apagado por */}
                <TableCell>
                  {!r.inicio ? "Sistema" : (r.apagadoPor || userName || "N/A")}
                </TableCell>

                {/* Modo */}
                <TableCell>{r.modo || "auto"}</TableCell>

                {/* Estado */}
                <TableCell>{r.estado ? "Encendido" : "Apagado"}</TableCell>

                {/* Tiempo Encendido */}
                <TableCell>{r.tiempoEncendido || "00:00:00"}</TableCell>

                {/* Tiempo Apagado */}
                <TableCell>{r.tiempoApagado || "00:00:00"}</TableCell>

                {/* Tiempo Manual */}
                <TableCell>
                  {r.tiempoMs ? Math.floor(r.tiempoMs / 1000) : "0"}
                </TableCell>

                {/* Inicio ciclo */}
                <TableCell>
                  {r.inicio
                    ? new Date(r.inicio).toLocaleString("es-CO", {
                        hour12: true,
                      })
                    : "—"}
                </TableCell>

                {/* Fin ciclo */}
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
