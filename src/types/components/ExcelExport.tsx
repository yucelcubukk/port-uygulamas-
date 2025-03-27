import React from "react";
import { Button } from "primereact/button";
import * as XLSX from "xlsx";
import { Port } from "../portTypes";

interface ExcelExportProps {
  ports: Port[];
}

const ExcelExport: React.FC<ExcelExportProps> = ({ ports }) => {
  const handleExport = () => {
    if (ports.length === 0) {
      alert("Dışa aktarılacak veri yok.");
      return;
    }

    // Dosya adını kullanıcıdan al
    const fileName = prompt("Kaydedilecek dosya adını girin (uzantısız):", "Port_Listesi");

    // Kullanıcı boş bıraktıysa ya da iptal ettiyse çık
    if (!fileName || fileName.trim() === "") {
      alert("Dosya adı geçerli değil.");
      return;
    }

    // 'id' alanını hariç tutarak veri hazırlama
    const exportData = ports.map(({ id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Portlar");

    // Dosyayı kullanıcıdan alınan isimle kaydet
    XLSX.writeFile(workbook, `${fileName.trim()}.xlsx`);
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
