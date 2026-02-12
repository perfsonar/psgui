// src/components/RadioGroupNative.jsx
import React from "react";

export default function RadioGroupNative({
  name,
  value,
  onChange,
  options,
  ariaLabel,
  className,       // wrapper class (optional)
  inputClassName,  // class applied to each <input>
}) {
  if (!name) throw new Error('RadioGroupNative: "name" prop is required.');
  if (!Array.isArray(options)) throw new Error('RadioGroupNative: "options" must be an array.');

  const selected = value == null ? "" : String(value);

  return (
    <div className={className} role="radiogroup" aria-label={ariaLabel || name}>
      {options.map((opt, idx) => {
        const optValue = String(opt.value);
        const checked = selected === optValue;

        return (
          <React.Fragment key={optValue}>
            <input
              className={inputClassName}
              type="radio"
              name={name}
              value={optValue}
              checked={checked}
              disabled={Boolean(opt.disabled)}
              onChange={() => onChange(optValue)}
            />{" "}
            {opt.label}
            {idx < options.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}
