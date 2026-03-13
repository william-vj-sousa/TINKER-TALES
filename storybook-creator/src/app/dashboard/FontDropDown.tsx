import { useState } from "react";

export type FontSize = "small" | "medium" | "large" | 'xl';

interface FontSizeDropdownProps {
  value: FontSize;
  onChange: (val: FontSize) => void;
}

export function FontSizeDropdown({ value, onChange }: FontSizeDropdownProps) {
  const [open, setOpen] = useState(false);

  const options: { label: string; value: FontSize; class: string }[] = [
    { label: "Small", value: "small", class: "text-xs" },
    { label: "Medium", value: "medium", class: "text-base" },
    { label: "Large", value: "large", class: "text-xl" },
    { label: "XL", value: "xl", class: "text-3xl" }
  ];

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="flex justify-between mb-4">
      <label className="block mb-2">Font Size</label>
      
      <div className="relative flex w-[10rem]">
            <button
                type="button"
                className={`w-full text-left border p-2 rounded cursor-pointer text-base`}
                onClick={() => setOpen((prev) => !prev)}
            >
                <div className="flex">
                    {selected?.label || "Select font size"}
                </div>
                
            </button>

            {open && (
                <div className="absolute mt-12 w-full border bg-white rounded shadow z-10">
                {options.map((opt) => (
                    <div
                    key={opt.value}
                    className={`p-2 hover:bg-blue-100 cursor-pointer ${opt.class} ${
                        value === opt.value ? "bg-blue-50" : ""
                    }`}
                    onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                    }}
                    >
                    {opt.label}
                    </div>
                ))}
                </div>
            )}
      </div>


    </div>
  );
}
