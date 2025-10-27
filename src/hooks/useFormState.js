import { useState } from "react";

export function useFormState(initialValues = {}) {
  const [values, setValues] = useState(initialValues);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues(function (prev) {
      return {
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      };
    });
  }

  function resetForm() {
    setValues(initialValues);
  }

  return { values, handleChange, setValues, resetForm };
}
