import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFormValues } from "../BillingForm";

interface CardNumberFieldProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

const CardNumberField: React.FC<CardNumberFieldProps> = ({ register, errors }) => (
  <label className="flex flex-col gap-2 text-slate-700 font-semibold">
    Card Number
    <input {...register("cardNumber")}
      type="text"
      placeholder="1234 5678 9012 3456"
      maxLength={19}
      className="rounded-lg border border-slate-200 px-4 py-3 bg-[#f6f7f9] focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition outline-none text-base tracking-widest"
    />
    {errors.cardNumber && <span className="text-red-500 text-sm">{errors.cardNumber.message}</span>}
  </label>
);

export default CardNumberField;
