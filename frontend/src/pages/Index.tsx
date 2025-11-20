import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AgeGateModal } from "@/components/AgeGateModal";
import { ShieldCheck, FileCheck, Lock, ArrowRight } from "lucide-react";
import heroLab from "@/assets/hero-lab.jpg";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

const Index = () => {
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <AgeGateModal />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
          style={{
            background: `var(--hero-gradient), url(${heroLab})`,
            backgroundColor: "white",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/50" />
          
          <div className="container relative z-10 mx-auto px-4 py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-6 ruo-badge">
                <ShieldCheck className="h-4 w-4" />
                FOR RESEARCH USE ONLY
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Research-Grade Peptides —{" "}
                <span className="text-primary">Verified COAs</span>,{" "}
                Rapid Processing
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Amino's supplies laboratory-grade peptides for research use only. 
                Fast order processing.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="btn-gold h-14 px-8 text-base">
                  <Link to="/products">
                    Shop Peptides <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base btn-secondary">
                  <Link to="/legal">
                    View COAs & Policies
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Verified COAs</h3>
                  <p className="text-muted-foreground text-sm">
                    Verified COAs available for every lot, ensuring quality and transparency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Secure Checkout</h3>
                  <p className="text-muted-foreground text-sm">
                    Secure PayPal checkout + SSL encryption for safe transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Rapid Processing</h3>
                  <p className="text-muted-foreground text-sm">
                    Order confirmation emailed to buyer & supplier within 24-72 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
              <p className="text-xl text-muted-foreground">
                High-purity peptides for your research needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" variant="outline" className="btn-secondary">
                <Link to="/products">
                  View All Products <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust Logos */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-wider">
              Trusted by Research Laboratories
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileCheck className="h-8 w-8" />
                <span className="font-semibold">COA Verified</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="h-8 w-8" />
                <span className="font-semibold">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-8 w-8" />
                <span className="font-semibold">PayPal Protected</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/faq" className="p-6 border border-border rounded-xl hover:shadow-lg transition-all group">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Frequently Asked Questions
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Find answers to common questions about our products and policies.
                </p>
                <span className="text-primary text-sm font-medium">
                  Learn More →
                </span>
              </Link>

              <Link to="/contact" className="p-6 border border-border rounded-xl hover:shadow-lg transition-all group">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Contact Support
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Have questions? Our team is here to help with your research needs.
                </p>
                <span className="text-primary text-sm font-medium">
                  Get in Touch →
                </span>
              </Link>

              <Link to="/legal" className="p-6 border border-border rounded-xl hover:shadow-lg transition-all group">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  Terms & Policies
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Review our comprehensive legal policies and research use terms.
                </p>
                <span className="text-primary text-sm font-medium">
                  View Policies →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
