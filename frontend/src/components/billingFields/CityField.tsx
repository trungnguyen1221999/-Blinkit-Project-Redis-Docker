import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFormValues } from "../BillingForm";
import { FINNISH_CITIES } from "../../constants/finlandCities";

interface CityFieldProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

const CityField: React.FC<CityFieldProps> = ({ register, errors }) => (
  <label className="flex-1 flex flex-col gap-2 text-slate-700 font-semibold">
    City
    <select {...register("city")}
      className="rounded-lg border border-slate-200 px-4 py-3 bg-[#f6f7f9] focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition outline-none text-base">
      <option value="">Select City</option>
      {FINNISH_CITIES.map(city => (
        <option key={city} value={city}>{city}</option>
      ))}
    </select>
    {errors.city && <span className="text-red-500 text-sm">{errors.city.message}</span>}
  </label>
);

export default CityField;
