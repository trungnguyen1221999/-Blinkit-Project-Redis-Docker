import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface CVVFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const CVVField: React.FC<CVVFieldProps> = ({ register, errors }) => (
  <label className="flex-1 flex flex-col gap-2 text-slate-700 font-semibold">
    CVV
    <input {...register("cvv")}
      type="password"
      maxLength={4}
      placeholder="123"
      className="rounded-lg border border-slate-200 px-4 py-3 bg-[#f6f7f9] focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition outline-none text-base"
    />
    {errors.cvv && typeof errors.cvv.message === 'string' && (
      <span className="text-red-500 text-sm">{errors.cvv.message}</span>
    )}
  </label>
);

export default CVVField;
