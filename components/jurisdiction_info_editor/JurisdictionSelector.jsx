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
        control: (base, state) => ({
          ...base,
          borderRadius: "0.25rem",
          border: "1px solid #d1d5db",
          paddingLeft: "0.25rem",
          paddingRight: "0.25rem",
          paddingTop: "0.25rem",
          paddingBottom: "0.25rem",
          backgroundColor: state.isDisabled ? "#f9fafb" : "white",
          boxShadow: state.isFocused ? "unset" : base.boxShadow
        }),
      }}
      noOptionsMessage={() => "No results found."}
    />
  );
}
