import { useCallback } from "react";
import AsyncSelect from "react-select/async";

export default function JurisdictionSelector({ initialValue, onSelect }) {
  const loadOptions = useCallback(
    async (inputValue, callback) => {
      if (!inputValue) {
        callback([]);

        return;
      }

      try {
        const res = await fetch(`/api/search_jurisdiction?q=${encodeURIComponent(inputValue)}`);

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

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultValue={initialValue}
      placeholder="Search for a jurisdiction"
      onChange={onSelect}
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: "10px",
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
          minHeight: "3.5rem",
          fontSize: "1.125rem",
          boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
          borderColor: "#d1d5db",
          backgroundColor: "white",
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "1rem",
          boxShadow: "0 8px 24px 0 rgba(0,0,0,0.08)",
        }),
      }}
      noOptionsMessage={() => "No results found."}
    />
  );
}
