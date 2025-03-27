// src/utils/excelExport.ts
import * as XLSX from "xlsx";
import { Port } from "../types/portTypes";

export const exportToExcel = (ports: Port[]) => {
  if (ports.length === 0) {
    alert("Dışa aktarılacak veri yok.");
    return;
  }

  const exportData = ports.map(({ id, ...rest }) => rest);
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Portlar");

  XLSX.writeFile(workbook, "Port_Listesi.xlsx");
};
