import React, { useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import * as XLSX from "xlsx";
import { Port } from "../portTypes";

interface ExcelUploadProps {
  onImport: (ports: Port[]) => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onImport }) => {
  const fileUploadRef = useRef<FileUpload>(null);
  const toastRef = useRef<Toast>(null);

  const handleFileUpload = (event: { files: File[] }) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      const importedPorts: Port[] = jsonData.map((row, index) => ({
        id: Date.now() + index,
        portNumber: row["Port No"] || row["portNumber"] || "",
        projectName: row["Proje Adı"] || row["projectName"] || "",
        applicationName: row["Uygulama Adı"] || row["applicationName"] || "",
        description: row["Açıklama"] || row["description"] || "",
      }));

      onImport(importedPorts);
      fileUploadRef.current?.clear();
      toastRef.current?.show({
        severity: "success",
        summary: "Yükleme Başarılı",
        detail: `${file.name} yüklendi`,
        life: 3000,
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <Toast ref={toastRef} />
      <FileUpload
        ref={fileUploadRef}
        mode="basic"
        accept=".xlsx"
        chooseLabel="📥 Excel Yükle"
        customUpload
        onSelect={handleFileUpload}
      />
    </div>
  );
};

export default ExcelUpload;