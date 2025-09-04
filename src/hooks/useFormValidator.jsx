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
      [name]: validationMessage || "",
    }));

    // Ignore avatar field when checking validity
    const requiredInputs = Array.from(form.elements).filter(
      (el) => el.required && el.name !== "avatarUrl"
    );
    setIsValid(requiredInputs.every((el) => el.checkValidity()));
  }

  function resetForm(newValues = initialValues) {
    setValues(newValues);
    setErrors({});
    setIsValid(true); // assume form is valid after resetting
  }

  return { values, errors, isValid, handleChange, resetForm };
}

export default useFormValidator;
