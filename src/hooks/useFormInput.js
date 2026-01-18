import { useState } from "react";

function useFormInput(initialValue) {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(''); 
  
    // This function is used for handling input changes.
    const handleInputChange = (e) => {
      const newValue = e.target.value;
  
      // Update the state with the new input value.
      setValue(newValue);
  
      // Clear any previous validation error by setting an empty string.
      setError('');
    }
  
    // Return the value, error, and the handleInputChange function.
    return {
      value,
      error,
      onChange: handleInputChange, // This is the function to be used for onChange event.
      setError, // Optionally, you can also expose setError if you need to set errors manually.
    };
  }

  
  export default useFormInput;