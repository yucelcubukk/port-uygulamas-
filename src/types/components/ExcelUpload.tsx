import React from "react";
import { FileUpload } from "primereact/fileupload";
import * as XLSX from "xlsx";
import { Port } from "../types/portTypes";

interface ExcelUploadProps {
  onImport: (ports: Port[]) => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onImport }) => {
  const handleFileUpload = (event: { files: File[] }) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      const importedPorts: Port[] = jsonData.map((row, index) => ({
        id: index + 1,
        portNumber: row["Port No"] || "",
        projectName: row["Proje Adı"] || "",
        applicationName: row["Uygulama Adı"] || "",
        description: row["Açıklama"] || "",
      }));

      onImport(importedPorts);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <FileUpload
      mode="basic"
      accept=".xlsx"
      chooseLabel="📥 Excel Yükle"
      customUpload
      onSelect={handleFileUpload}
    />
  );
};

export default ExcelUpload;
