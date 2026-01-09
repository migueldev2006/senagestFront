import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  registros: any[];
}

export default function BrokerStateChart({ registros }: Props) {
  // Procesar registros para extraer timestamps y estados
  const chartData = registros
    .filter((r) => r.estado !== null && r.estado !== undefined && r.fechaCreacion)
    .map((r) => {
      const fecha = new Date(r.fechaCreacion);
      const time = fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const stateValue = r.estado ? 1 : 0; // 1 para true (Encendido), 0 para false (Apagado)

      return {
        time,
        timestamp: fecha.getTime(),
        estado: stateValue,
        estadoLabel: r.estado ? 'Encendido' : 'Apagado',
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-50); // Mostrar últimos 50 registros para mejor visualización

  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-80 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No hay datos disponibles para la gráfica</p>
      </div>
    );
  }

  return (
    <div className="w-full h-80 mt-6 bg-white p-4 rounded-lg shadow">
      <h3 className="text-center font-bold mb-4">Estado del Broker en el Tiempo</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            domain={[0, 1]}
            ticks={[0, 1]}
            tickFormatter={(value) => value === 1 ? 'Encendido' : 'Apagado'}
          />
          <Tooltip 
            formatter={(value) => value === 1 ? 'Encendido' : 'Apagado'}
            labelFormatter={(label) => `Hora: ${label}`}
          />
          <Legend />
          <Line 
            type="stepAfter" 
            dataKey="estado" 
            stroke="#3b82f6" 
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Estado del Broker"
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
