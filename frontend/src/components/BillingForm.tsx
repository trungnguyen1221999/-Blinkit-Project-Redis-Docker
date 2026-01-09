
export type ProductCheckout = {
  _id: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
};
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createOrderApi } from "../api/orderApi";
import { resetCartApi } from "../api/cartApi";
import { useAuth } from "../Context/AuthContext";
import OrderSuccessPopup from "./OrderSuccessPopup";
import OrderErrorPopup from "./OrderErrorPopup";
import FullNameField from "./billingFields/FullNameField";
import EmailField from "./billingFields/EmailField";
import PhoneField from "./billingFields/PhoneField";
import AddressField from "./billingFields/AddressField";
import CityField from "./billingFields/CityField";
import CountryField from "./billingFields/CountryField";
import PostalCodeField from "./billingFields/PostalCodeField";
import CardNumberField from "./billingFields/CardNumberField";
import ExpiryField from "./billingFields/ExpiryField";
import CVVField from "./billingFields/CVVField";
import NameOnCardField from "./billingFields/NameOnCardField";

// Add your validation schema and types as needed
// import { billingSchema } from "../utils/billingSchema";

export type CheckoutFormValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
};

import { completeAbandonOrderApi } from "../api/orderApi";

interface BillingFormProps {
  products?: ProductCheckout[];
  total?: number;
  totalSave?: number;
  abandonOrder?: any;
}

const BillingForm: React.FC<BillingFormProps> = ({ products = [], total = 0, totalSave = 0, abandonOrder }) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  // Use guestId if not logged in (same logic as Cart)
  const guestIdRaw = !user ? localStorage.getItem("guestId") : undefined;
  const guestId = guestIdRaw ?? undefined;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutFormValues>({
    // resolver: zodResolver(billingSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "Kai",
      email: "test@example.com",
      phone: "0401234567",
      address: "123 Main St",
      city: "Helsinki",
      country: "Finland",
      postalCode: "00100",
      cardNumber: "4242 4242 4242 4242",
      expiry: "12/25",
      cvv: "123",
      nameOnCard: "Kai",
    },
  });

  // Add your submit handler here
  const onSubmit = async (data: any) => {
    try {
      // Generate orderId, paymentId, and invoice_receipt
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const invoice_receipt = `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const product_detail = products.map(p => ({
        name: p.name || "",
        image: p.image ? [p.image] : [],
        quantity: p.quantity || 1,
        price: p.price || 0,
      }));
      const productId = products.map(p => p._id);
      const subTotalAmt = products.reduce((sum, p) => sum + (p.price || 0), 0);
      let payload = {
        ...data,
        product_detail,
        productId,
        subTotalAmt,
        totalAmt: total,
        payment_status: "Completed",
        orderId,
        paymentId,
        invoice_receipt,
      };
      if (user?._id) payload.userId = user._id;
      if (guestId) payload.guestId = guestId;

      // If abandonOrder exists, complete it instead of creating a new order
      let response;
      if (abandonOrder && abandonOrder.orderId) {
        response = await completeAbandonOrderApi({
          orderId: abandonOrder.orderId,
          paymentId,
          invoice_receipt,
          payment_status: "Completed",
          ...data,
        });
      } else {
        response = await createOrderApi(payload);
      }
      setOrderDetail(response);
      reset();
    } catch (err: any) {
      setError(err?.message || "Payment failed");
    }
  };

  return (
    <>
      {orderDetail && (
        <OrderSuccessPopup
          orderDetail={orderDetail}
          total={total}
          totalSave={totalSave}
          products={products}
          onClose={async () => {
            setOrderDetail(null);
            // Reset cart in React Query
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            // Clear cart in localStorage (for guest)
            localStorage.removeItem("cart");
            // Reset cart in backend
            await resetCartApi({ userId: user?._id, guestId });
            // Redirect
            if (user?._id) {
              window.location.href = "/user/purchases";
            } else {
              window.location.href = "/";
            }
          }}
        />
      )}
      {error && (
        <OrderErrorPopup
          error={error}
          onClose={() => setError(null)}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4 bg-white rounded-xl shadow-md">
        <FullNameField register={register} errors={errors} />
        <EmailField register={register} errors={errors} />
        <PhoneField register={register} errors={errors} />
        <AddressField register={register} errors={errors} />
        <div className="flex gap-4">
          <CityField register={register} errors={errors} />
          <CountryField register={register} errors={errors} />
        </div>
        <PostalCodeField register={register} errors={errors} />
        <CardNumberField register={register} errors={errors} />
        <div className="flex gap-4">
          <ExpiryField register={register} errors={errors} />
          <CVVField register={register} errors={errors} />
        </div>
        <NameOnCardField register={register} errors={errors} />
        <button type="submit" className="mt-4 py-4 px-8 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold text-xl shadow-lg hover:from-green-600 hover:to-emerald-700 transition w-full">Pay Now</button>
      </form>
    </>
  );
};

export default BillingForm;