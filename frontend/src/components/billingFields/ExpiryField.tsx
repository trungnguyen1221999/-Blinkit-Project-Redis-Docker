import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface ExpiryFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const ExpiryField: React.FC<ExpiryFieldProps> = ({ register, errors }) => (
  <label className="flex-1 flex flex-col gap-2 text-slate-700 font-semibold">
    Expiry
    <input
      type="text"
      placeholder="MM/YY"
      maxLength={5}
      className="rounded-lg border border-slate-200 px-4 py-3 bg-[#f6f7f9] focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition outline-none text-base"
      {...register("expiry")}
      onInput={e => {
        const input = e.target as HTMLInputElement;
        let value = input.value.replace(/[^\d]/g, "");
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length === 2) {
          value = value + "/";
        } else if (value.length > 2) {
          value = value.slice(0, 2) + "/" + value.slice(2);
        }
        input.value = value;
      }}
    />
    {errors.expiry && typeof errors.expiry.message === 'string' && (
      <span className="text-red-500 text-sm">{errors.expiry.message}</span>
    )}
  </label>
);

export default ExpiryField;
