// Source: https://usehooks.com/useLocalStorage/

import { useEffect, useRef, useState } from "react";

export function useCustomLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  const setValueWithoutStorage = (value: T | ((val: T) => T)) =>
    setStoredValue(value);

  const intervalRef = useRef<NodeJS.Timer>();
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // setValue(storedValue);
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return [storedValue, setValue, setValueWithoutStorage] as const;
}
