import { useState } from "react";

export function useFormState(initialValues = {}) {
  const [values, setValues] = useState(initialValues);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => setValues(initialValues);

  return { values, handleChange, setValues, resetForm };
}
