import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFormValues } from "../BillingForm";

interface CountryFieldProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

const CountryField: React.FC<CountryFieldProps> = ({ register, errors }) => (
  <label className="flex-1 flex flex-col gap-2 text-slate-700 font-semibold">
    Country
    <input {...register("country")}
      type="text"
      placeholder="Country"
      className="rounded-lg border border-slate-200 px-4 py-3 bg-[#f6f7f9] focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition outline-none text-base"
      readOnly
    />
    {errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}
  </label>
);

export default CountryField;
