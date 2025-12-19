import { findJurisdictionsByName } from "@/services/JurisdictionGisService";
import { useCallback, useEffect, useState, useRef } from "react";
import AsyncSelect from "react-select/async";

interface Option {
  value: string;
  label: string;
}

interface JurisdictionSelectorProps {
  value?: Option | Option[];
  exclude?: any;
  isMulti?: boolean;
  onChange?: (value: Option | Option[]) => void;
  onBlur?: () => void;
}

export default function JurisdictionSelector({
  value,
  exclude,
  isMulti,
  onChange,
  onBlur,
}: JurisdictionSelectorProps) {
  const [defaultOptions, setDefaultOptions] = useState<Option[]>();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const loadOptions = useCallback(
    (inputValue: string, callback: (options: Option[]) => void) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        try {
          const result = await findJurisdictionsByName(inputValue, exclude);
          callback(result);
        } catch {
          callback([]);
        }
      }, 300); // 300ms debounce delay
    },
    [exclude]
  );

  useEffect(() => {
    const loadAll = async () => {
      try {
        const data = await findJurisdictionsByName("", exclude);
        setDefaultOptions(data);
      } catch {
        setDefaultOptions([]);
      }
    };

    loadAll();
  }, [exclude]);

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      value={value}
      placeholder="Search for a jurisdiction"
      isMulti={isMulti}
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
