import PageTitle from "@/components/atoms/PageTitle";
import CustomCard from "../../components/atoms/Card"; // Este lo crearé abajo
import { CardBody } from "@heroui/react";
import CustomButton from "@/components/atoms/CustomButton";

export default function PisciculturaPage() {
  return (
    <>
      <PageTitle>Piscicultura</PageTitle>

      {/* GRID DE 3 CARDS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
        <CustomCard
          title="Control de Estanques"
          img="https://images.unsplash.com/photo-1544551763-46a013bb70d5"
        >
          <p>Monitoreo de niveles, oxígeno y limpieza de estanques.</p>
        </CustomCard>

        <CustomCard
          title="Alimentación"
          img="https://images.unsplash.com/photo-1518837695005-2083093ee35b"
        >
          <p>Gestión de raciones, horarios y consumo de alimento.</p>
        </CustomCard>

        <CustomCard
          title="Crecimiento"
          img="https://images.unsplash.com/photo-1616509091249-3f8ccb0e8f02"
        >
          <p>Seguimiento del peso, talla y estado sanitario del pez.</p>
        </CustomCard>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <CustomButton>Reportes</CustomButton>
        <CustomButton>Configurar Tiempo</CustomButton>
        <CustomButton>Configuración Broker</CustomButton>
      </div>
    </>
  );
}
