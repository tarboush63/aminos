import React from "react";
import { Link } from "react-router-dom";

const Success = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold mb-4">Thank you for your order!</h1>
    <p className="mb-6">Our sales team will contact you shortly to confirm the details.</p>
    <Link to="/products" className="btn-gold">Continue Shopping</Link>
  </div>
);

export default Success;
