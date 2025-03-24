import React, { useEffect } from "react";
import { Port } from "../types/portTypes";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface PortFormProps {
  port?: Port; // düzenleme için
  onAdd: (port: Omit<Port, "id">) => void;
  onUpdate?: (port: Port) => void;
}

const PortForm: React.FC<PortFormProps> = ({ port, onAdd, onUpdate }) => {
  const formik = useFormik({
    initialValues: {
      portNumber: "",
      projectName: "",
      applicationName: "",
      description: "",
    },
    validationSchema: Yup.object({
      portNumber: Yup.string().required("Port numarası zorunludur"),
      projectName: Yup.string().required("Proje adı zorunludur"),
      applicationName: Yup.string().required("Uygulama adı zorunludur"),
    }),
    onSubmit: (values) => {
      if (port && onUpdate) {
        onUpdate({ ...port, ...values });
      } else {
        onAdd(values);
      }
    },
    enableReinitialize: true, // düzenleme için formu yeniden doldur
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
      <span className="p-float-label">
        <InputText
          id="portNumber"
          value={formik.values.portNumber}
          onChange={formik.handleChange}
          className={formik.errors.portNumber && formik.touched.portNumber ? "p-invalid" : ""}
        />
        <label htmlFor="portNumber">Port No</label>
      </span>

      <span className="p-float-label">
        <InputText
          id="projectName"
          value={formik.values.projectName}
          onChange={formik.handleChange}
          className={formik.errors.projectName && formik.touched.projectName ? "p-invalid" : ""}
        />
        <label htmlFor="projectName">Proje Adı</label>
      </span>

      <span className="p-float-label">
        <InputText
          id="applicationName"
          value={formik.values.applicationName}
          onChange={formik.handleChange}
          className={formik.errors.applicationName && formik.touched.applicationName ? "p-invalid" : ""}
        />
        <label htmlFor="applicationName">Uygulama Adı</label>
      </span>

      <span className="p-float-label">
        <InputText
          id="description"
          value={formik.values.description}
          onChange={formik.handleChange}
        />
        <label htmlFor="description">Açıklama</label>
      </span>

      <Button type="submit" label={port ? "Güncelle" : "Ekle"} icon="pi pi-check" />
    </form>
  );
};

export default PortForm;
