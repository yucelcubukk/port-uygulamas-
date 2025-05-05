import React, { useState, useRef, useEffect } from "react";
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

  useEffect(() => {
    const fetchInitialPorts = async () => {
      try {
        const response = await fetch("http://localhost:5050/ports");
        const data = await response.json();
  
        const convertedPorts: Port[] = data.data.map((item: any) => ({
          id: item.id,
          portNumber: item.port_number,
          projectName: item.project_name,
          applicationName: item.application_name,
          description: item.description,
        }));
  
        setPorts(convertedPorts);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };
  
    fetchInitialPorts();
  }, []);
  

  const addPort = async (newPort: Omit<Port, "id">) => {
    try {
      const response = await fetch("http://localhost:5050/ports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          port_number: newPort.portNumber,
          project_name: newPort.projectName,
          application_name: newPort.applicationName,
          description: newPort.description,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const addedPort: Port = {
          id: result.data.id,
          portNumber: result.data.port_number,
          projectName: result.data.project_name,
          applicationName: result.data.application_name,
          description: result.data.description,
        };

        setPorts([...ports, addedPort]);
        toast.current?.show({
          severity: "success",
          summary: "Başarılı",
          detail: "Yeni port veritabanına eklendi.",
          life: 3000,
        });
        setIsDialogVisible(false);
      } else {
        throw new Error(result.error || "Veri eklenemedi.");
      }
    } catch (error) {
      console.error("Ekleme hatası:", error);
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Port eklenirken bir hata oluştu.",
        life: 3000,
      });
    }
  };

  const updatePort = async (updated: Port) => {
    try {
      const response = await fetch(`http://localhost:5050/ports/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          port_number: updated.portNumber,
          project_name: updated.projectName,
          application_name: updated.applicationName,
          description: updated.description,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPorts(ports.map((p) => (p.id === updated.id ? updated : p)));
        toast.current?.show({
          severity: "info",
          summary: "Güncellendi",
          detail: "Port başarıyla güncellendi.",
          life: 3000,
        });
        setIsDialogVisible(false);
        setEditingPort(null);
      } else {
        throw new Error(result.error || "Güncelleme başarısız.");
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      toast.current?.show({
        severity: "error",
        summary: "Hata",
        detail: "Port güncellenirken bir hata oluştu.",
        life: 3000,
      });
    }
  };

  const deletePort = async (port: Port) => {
    confirmDialog({
      message: `${port.portNumber} numaralı port silinsin mi?`,
      header: "Silme Onayı",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          const response = await fetch(`http://localhost:5050/ports/${port.id}`, {
            method: "DELETE",
          });
          const result = await response.json();
          if (result.success) {
            setPorts(ports.filter((p) => p.id !== port.id));
            toast.current?.show({
              severity: "warn",
              summary: "Silindi",
              detail: "Port başarıyla silindi.",
              life: 3000,
            });
          } else {
            throw new Error(result.error || "Silme başarısız.");
          }
        } catch (error) {
          console.error("Silme hatası:", error);
          toast.current?.show({
            severity: "error",
            summary: "Hata",
            detail: "Port silinirken bir hata oluştu.",
            life: 3000,
          });
        }
      },
    });
  };

  const handleEdit = (port: Port) => {
    setEditingPort(port);
    setIsDialogVisible(true);
  };

  const importPorts = (importedPorts: Port[]) => {
    const maxId = ports.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newPorts = importedPorts.map((p, index) => ({
      ...p,
      id: maxId + index + 1,
    }));
    setPorts([...ports, ...newPorts]);
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

      <PortList ports={ports} onDelete={deletePort} onEdit={handleEdit} />

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
            onUpdate={updatePort}
          />
        </div>
      </Dialog>

      <ConfirmDialog />
    </div>
  );
};

export default App;
