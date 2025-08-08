import { useState } from "react";

function useFormValidator(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  function handleChange(e) {
    const { name, value, validationMessage, form } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]:
        name === "weather"
          ? value
            ? ""
            : "Please select a weather type."
          : validationMessage,
    }));

    setIsValid(form.checkValidity());
  }

  function resetForm(newValues = initialValues) {
    setValues(newValues);
    setErrors({});
    setIsValid(false);
  }

  return { values, errors, isValid, handleChange, resetForm };
}

export default useFormValidator;
