import { useEffect, useRef, useState } from "react";

export default function Dropdown({
  label,
  options = [], // [{ value, label }]
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!btnRef.current || !popRef.current) return;
      if (!btnRef.current.contains(e.target) && !popRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSelect = (val) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <button
        ref={btnRef}
        type="button"
        className="w-full p-2 border border-gray-300 rounded-md text-left bg-white cursor-pointer"
        onClick={() => setOpen((s) => !s)}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
      </button>

      {open && (
        <div
          ref={popRef}
          className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={active}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  active ? "bg-gray-100 font-medium" : ""
                }`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
