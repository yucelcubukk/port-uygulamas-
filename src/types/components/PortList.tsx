import React from "react";
import { Port } from "../types/portTypes";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

interface PortListProps {
  ports: Port[];
  onDelete: (id: number) => void;
  onEdit: (port: Port) => void;
}

const PortList: React.FC<PortListProps> = ({ ports, onDelete, onEdit }) => {
  const actionTemplate = (rowData: Port) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => onEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => onDelete(rowData.id)}
        />
      </div>
    );
  };

  return (
    <DataTable value={ports} paginator rows={5} emptyMessage="No available options">
      <Column field="portNumber" header="Port No" sortable filter filterPlaceholder="Ara..." />
      <Column field="projectName" header="Proje Adı" sortable filter filterPlaceholder="Ara..." />
      <Column field="applicationName" header="Uygulama Adı" sortable filter filterPlaceholder="Ara..." />
      <Column field="description" header="Açıklama" sortable filter filterPlaceholder="Ara..." />
      <Column header="İşlem" body={actionTemplate} />
    </DataTable>
  );
};

export default PortList;
