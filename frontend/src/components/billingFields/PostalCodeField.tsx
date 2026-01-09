import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface PostalCodeFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const PostalCodeField: React.FC<PostalCodeFieldProps> = ({ register, errors }) => (
  <label className="flex flex-col gap-2 text-slate-700 font-semibold">
    Postal Code
    <input {...register("postalCode")}
      type="text"
      placeholder="Postal Code"
      className="rounded-lg border border-slate-200 px-4 py-3 bg-[#f6f7f9] focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition outline-none text-base"
    />
    {errors.postalCode && typeof errors.postalCode.message === 'string' && (
      <span className="text-red-500 text-sm">{errors.postalCode.message}</span>
    )}
  </label>
);

export default PostalCodeField;
