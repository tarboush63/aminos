import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("orderId");

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Payment Completed</h1>
      <p className="mb-4">Your order has been submitted to the payment gateway.</p>
      <p className="mb-4">Final approval is confirmed by the payment callback endpoint.</p>

      {orderId && (
        <p className="mb-4 text-sm text-muted-foreground">Order reference: <strong>{orderId}</strong></p>
      )}

      <p className="mb-6">If you need support, please contact our team with your order reference.</p>
      <Link to="/products" className="btn-gold">Continue Shopping</Link>
    </div>
  );
};

export default Success;
