import { Button, Form, Input } from "@heroui/react";

export default function ConfigBrokerForm({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Form className=" ">
        <Input type="text" label="Url" />
        <Input type="text" label="Usuario" />
        <Input type="text" label="Contraseña" />

        <div className="flex ms-auto gap-4">
          <Button
            type="button"
            color="danger"
            variant="light"
            onPress={onClose}
          >
            Cancelar
          </Button>

          <Button type="submit" color="success" className="text-white">
            Conectar
          </Button>
        </div>
      </Form>
    </>
  );
}
