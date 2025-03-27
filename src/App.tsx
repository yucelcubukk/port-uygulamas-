import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Port } from "./types/portTypes";
import PortList from "./types/components/PortList";
import PortForm from "./types/components/PortForm";
import ExcelUpload from "./types/components/ExcelUpload";
import { exportToExcel } from "./utils/excelExport";

const App: React.FC = () => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [editingPort, setEditingPort] = useState<Port | null>(null);
  const toast = useRef<Toast>(null);

  const addPort = (newPort: Omit<Port, "id">) => {
    setPorts([...ports, { ...newPort, id: ports.length + 1 }]);
    toast.current?.show({
      severity: "success",
      summary: "Başarılı",
      detail: "Yeni port eklendi.",
      life: 3000,
    });
    setIsDialogVisible(false);
  };

  const confirmUpdate = (updated: Port) => {
    confirmDialog({
      message: "Değişikliği yapmak istediğinize emin misiniz?",
      header: "Düzenleme Onayı",
      icon: "pi pi-pencil",
      accept: () => {
        setPorts(ports.map((p) => (p.id === updated.id ? updated : p)));
        toast.current?.show({
          severity: "info",
          summary: "Güncellendi",
          detail: "Port bilgileri güncellendi.",
          life: 3000,
        });
        setIsDialogVisible(false);
        setEditingPort(null);
      },
    });
  };

  const handleDelete = (port: Port) => {
    confirmDialog({
      message: `${port.portNumber} numaralı port silinsin mi?`,
      header: "Silme Onayı",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setPorts(ports.filter((p) => p.id !== port.id));
        toast.current?.show({
          severity: "warn",
          summary: "Silindi",
          detail: "Port başarıyla silindi.",
          life: 3000,
        });
      },
    });
  };

  const handleEdit = (port: Port) => {
    setEditingPort(port);
    setIsDialogVisible(true);
  };

  const importPorts = (importedPorts: Port[]) => {
    setPorts([...ports, ...importedPorts]);
  };

  return (
    <div className="p-6">
      <Toast ref={toast} />

      <h2 className="text-3xl font-bold mb-6 text-gray-800">Port Yönetim Uygulaması</h2>

      <div className="flex flex-wrap gap-3 justify-start mb-6">
        <ExcelUpload onImport={importPorts} />
        <Button
          label="Excel'e Aktar"
          icon="pi pi-file-excel"
          className="p-button-success"
          onClick={() => exportToExcel(ports)}
        />
        <Button
          label="Yeni Port Ekle"
          icon="pi pi-plus"
          className="p-button-primary p-button-outlined"
          onClick={() => {
            setEditingPort(null);
            setIsDialogVisible(true);
          }}
        />
      </div>

      <PortList ports={ports} onDelete={handleDelete} onEdit={handleEdit} />

      <Dialog
        header={editingPort ? "Port Güncelle" : "Yeni Port Ekle"}
        visible={isDialogVisible}
        onHide={() => {
          setIsDialogVisible(false);
          setEditingPort(null);
        }}
      >
        <div className="flex flex-col gap-4">
          <PortForm
            port={editingPort ?? undefined}
            onAdd={addPort}
            onUpdate={confirmUpdate}
          />
        </div>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
};

export default App;
