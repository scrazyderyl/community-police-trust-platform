import { useCallback, useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

export default function JurisdictionSelector({ value, exclude, onChange, onBlur }) {
  const [defaultOptions, setDefaultOptions] = useState();

  const loadOptions = useCallback(
    async (inputValue, callback) => {
      try {
        const res = exclude ?
          await fetch(`/api/search_jurisdiction?q=${encodeURIComponent(inputValue)}&exclude=${exclude}`) :
          await fetch(`/api/search_jurisdiction?q=${encodeURIComponent(inputValue)}`);

        if (!res.ok) {
          callback([]);

          return;
        }
        
        const data = await res.json();
        callback(data);
      } catch {
        callback([]);
      }
    },
    []
  );

  useEffect(() => {
    const loadAll = async () => {
      try {
        const res = await fetch("/api/search_jurisdiction?q=");
  
        if (res.ok) {
          const data = await res.json();
          
          setDefaultOptions(data)
        }
      } catch {
        
      }
      
    }
    
    loadAll();
  }, [])

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      value={value}
      placeholder="Search for a jurisdiction"
      onChange={onChange}
      onBlur={onBlur}
      styles={{
        container: (base) => ({
          ...base,
          width: "100%",
        }),
        control: (base) => ({
          ...base,
          borderRadius: "10px",
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
          paddingTop: "0.25rem",
          paddingBottom: "0.25rem",
          fontSize: "1.125rem",
        }),
      }}
      noOptionsMessage={() => "No results found."}
    />
  );
}
