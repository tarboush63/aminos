import { Link } from "react-router-dom";
import { ShieldCheck, Lock } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Amino's</h3>
            <p className="text-sm text-muted-foreground">
              Research-grade peptides for laboratory use only.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">SSL Secured</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Standard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Standard Line
                </Link>
              </li>
              <li>
                <Link to="/products?category=Premium" className="text-muted-foreground hover:text-foreground transition-colors">
                  Premium Line
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/legal/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/legal/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Sale
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/ruo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Research Use Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/refund" className="text-muted-foreground hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground font-medium">
              For Research Use Only — Not For Human Consumption
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Amino's. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
