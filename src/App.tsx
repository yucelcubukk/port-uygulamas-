import React, { useState } from "react";
import { Port } from "./types/portTypes";
import PortList from "./components/PortList";
import PortForm from "./components/PortForm";
import ExcelUpload from "./components/ExcelUpload";
import ExcelExport from "./components/ExcelExport";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const App: React.FC = () => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [editingPort, setEditingPort] = useState<Port | null>(null);

  const addPort = (port: Omit<Port, "id">) => {
    const newPort: Port = {
      ...port,
      id: ports.length + 1,
    };
    setPorts([...ports, newPort]);
    setDialogVisible(false);
  };

  const updatePort = (updated: Port) => {
    const updatedPorts = ports.map((p) => (p.id === updated.id ? updated : p));
    setPorts(updatedPorts);
    setEditingPort(null);
    setDialogVisible(false);
  };

  const deletePort = (id: number) => {
    setPorts(ports.filter((p) => p.id !== id));
  };

  const importPorts = (imported: Port[]) => {
    setPorts([...ports, ...imported]);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Port Yönetim Uygulaması</h2>
        <div className="flex gap-2">
          <ExcelExport ports={ports} />
          <Button label="Yeni Port Ekle" icon="pi pi-plus" onClick={() => setDialogVisible(true)} />
        </div>
      </div>

      <ExcelUpload onImport={importPorts} />

      <PortList ports={ports} onDelete={deletePort} onEdit={setEditingPort} />

      <Dialog
        header={editingPort ? "Port Güncelle" : "Yeni Port Ekle"}
        visible={isDialogVisible || editingPort !== null}
        onHide={() => {
          setDialogVisible(false);
          setEditingPort(null);
        }}
      >
        <PortForm
          port={editingPort ?? undefined}
          onAdd={addPort}
          onUpdate={updatePort}
        />
      </Dialog>
    </div>
  );
};

export default App;
