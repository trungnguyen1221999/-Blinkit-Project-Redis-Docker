import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFormValues } from "../BillingForm";

interface FullNameFieldProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

const FullNameField: React.FC<FullNameFieldProps> = ({ register, errors }) => (
  <label className="flex flex-col gap-2 text-slate-700 font-semibold">
    Full Name
    <input {...register("fullName")}
      type="text"
      placeholder="Full Name"
      className="rounded-lg border border-slate-200 px-4 py-3 bg-[#f6f7f9] focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition outline-none text-base"
    />
    {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
  </label>
);

export default FullNameField;
