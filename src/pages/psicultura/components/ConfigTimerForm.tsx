import { Button, Form, Input } from "@heroui/react";

export default function ConfigTimerForm({ onClose }: { onClose: () => void }) {
    return(
        <>
              <Form>
                <Input type="interval" label="Tiempo Encendido" />
                <Input type="interval" label="Tiempo Apagado" />
        
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
                    Aplicar 
                  </Button>
                </div>
              </Form>
        </>
    );
}