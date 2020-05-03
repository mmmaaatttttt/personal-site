import { useState } from "react";

function useLocalStorage(key, initialVal=null) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialVal;
    } catch (err) {
      console.warn(err);
      return initialVal;
    }
  });

  const syncAndSetValue = newValOrFn => {
    const newVal = newValOrFn instanceof Function ? newValOrFn(value) : newValOrFn;
    try {
      localStorage.setItem(key, JSON.stringify(newVal))
      setValue(newVal);
    } catch (err) {
      console.warn(err);
    }
  }

  const reset = () => localStorage.removeItem(key);

  return [value, syncAndSetValue, reset];
}

export default useLocalStorage;