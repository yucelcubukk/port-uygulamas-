import React from "react";
import { Button } from "primereact/button";
import * as XLSX from "xlsx";
import { Port } from "../types/portTypes";

interface ExcelExportProps {
  ports: Port[];
}

const ExcelExport: React.FC<ExcelExportProps> = ({ ports }) => {
  const handleExport = () => {
    if (ports.length === 0) {
      alert("Dışa aktarılacak veri yok.");
      return;
    }

    const exportData = ports.map(({ id, ...rest }) => rest); // id'yi çıkar
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Portlar");

    XLSX.writeFile(workbook, "Port_Listesi.xlsx");
  };

  return (
    <Button
      label="Excel'e Aktar"
      icon="pi pi-file-excel"
      className="p-button-success"
      onClick={handleExport}
    />
  );
};

export default ExcelExport;
