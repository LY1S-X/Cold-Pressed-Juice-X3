import type { Metadata } from "next";
import { OrderForm } from "./OrderForm";

export const metadata: Metadata = {
  title: "Order — Conscious Choice",
  robots: { index: false, follow: true },
};

export default function OrderPage() {
  return <OrderForm />;
}
