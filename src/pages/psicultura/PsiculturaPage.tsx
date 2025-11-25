import PageTitle from "@/components/atoms/PageTitle";
import CustomCard from "@/components/atoms/Card";
import { Fish, Wheat, BarChart2 } from "lucide-react"; // Íconos

export default function PisciculturaPage() {
  return (
    <>
      <PageTitle>Piscicultura</PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">

        <CustomCard
          title="Control de Estanques"
          icon={<Fish size={40} />}
        >
          <p>Monitoreo de niveles, oxígeno y limpieza de estanques.</p>
        </CustomCard>

        <CustomCard
          title="Alimentación"
          icon={<Wheat size={40} />}
        >
          <p>Gestión de raciones, horarios y consumo de alimento.</p>
        </CustomCard>

        <CustomCard
          title="Crecimiento"
          icon={<BarChart2 size={40} />}
        >
          <p>Seguimiento del peso, talla y estado sanitario del pez.</p>
        </CustomCard>

      </div>
    </>
  );
}
