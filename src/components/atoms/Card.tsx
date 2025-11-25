import { Card, CardHeader, CardBody } from "@heroui/react";

type Props = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export default function CustomCard({ title, icon, children }: Props) {
  return (
    <Card className="p-4 shadow-md">
      <CardHeader className="flex items-center gap-4">
        {/* Icono en la izquierda */}
        <div className="text-primary">{icon}</div>

        {/* Título a la izquierda */}
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>

      <CardBody className="text-left text-gray-600">
        {children}
      </CardBody>
    </Card>
  );
}
