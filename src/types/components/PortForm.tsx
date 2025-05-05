import React from "react";
import { Port } from "../portTypes";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface PortFormProps {
  port?: Port;
  onAdd: (port: Omit<Port, "id">) => void;
  onUpdate?: (port: Port) => void;
}

const PortForm: React.FC<PortFormProps> = ({ port, onAdd, onUpdate }) => {
  const formik = useFormik({
    initialValues: {
      portNumber: port?.portNumber || "",
      projectName: port?.projectName || "",
      applicationName: port?.applicationName || "",
      description: port?.description || "",
    },
    validationSchema: Yup.object({
      portNumber: Yup.string()
        .matches(/^[0-9]+$/, "Sadece rakam giriniz")
        .required("Port numarası boş bırakılamaz"),
      projectName: Yup.string().required("Proje adı boş bırakılamaz"),
      applicationName: Yup.string().required("Uygulama adı boş bırakılamaz"),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        id: port?.id ?? undefined, // ✅ ID kesin gidiyor!
      };

      if (port && onUpdate) {
        onUpdate(payload as Port);
      } else {
        onAdd({
          portNumber: values.portNumber,
          projectName: values.projectName,
          applicationName: values.applicationName,
          description: values.description
        });
      }
    },
    enableReinitialize: true,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-80 space-y-4">
      {/* Port No */}
      <div>
        <label htmlFor="portNumber" className="block font-semibold mb-1">
          Port No
        </label>
        <InputText
          id="portNumber"
          value={formik.values.portNumber}
          onChange={formik.handleChange}
          className={`w-full ${
            formik.touched.portNumber && formik.errors.portNumber ? "p-invalid" : ""
          }`}
        />
        {formik.touched.portNumber && formik.errors.portNumber && (
          <small className="p-error">{formik.errors.portNumber}</small>
        )}
      </div>

      {/* Proje Adı */}
      <div>
        <label htmlFor="projectName" className="block font-semibold mb-1">
          Proje Adı
        </label>
        <InputText
          id="projectName"
          value={formik.values.projectName}
          onChange={formik.handleChange}
          className={`w-full ${
            formik.touched.projectName && formik.errors.projectName ? "p-invalid" : ""
          }`}
        />
        {formik.touched.projectName && formik.errors.projectName && (
          <small className="p-error">{formik.errors.projectName}</small>
        )}
      </div>

      {/* Uygulama Adı */}
      <div>
        <label htmlFor="applicationName" className="block font-semibold mb-1">
          Uygulama Adı
        </label>
        <InputText
          id="applicationName"
          value={formik.values.applicationName}
          onChange={formik.handleChange}
          className={`w-full ${
            formik.touched.applicationName && formik.errors.applicationName ? "p-invalid" : ""
          }`}
        />
        {formik.touched.applicationName && formik.errors.applicationName && (
          <small className="p-error">{formik.errors.applicationName}</small>
        )}
      </div>

      {/* Açıklama (opsiyonel) */}
      <div>
        <label htmlFor="description" className="block font-semibold mb-1">
          Açıklama (opsiyonel)
        </label>
        <InputText
          id="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          className="w-full"
        />
      </div>

      {/* Ekle / Güncelle Buton */}
      <div className="flex justify-end">
        <Button
          type="submit"
          label={port ? "Güncelle" : "Ekle"}
          icon="pi pi-check"
        />
      </div>
    </form>
  );
};

export default PortForm;
