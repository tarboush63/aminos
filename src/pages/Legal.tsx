import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert } from "lucide-react";

const Legal = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="h-10 w-10 text-destructive" />
              <h1 className="text-4xl md:text-5xl font-bold">Legal & Policies</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Important information about purchasing and using our research products
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="terms">Terms of Sale</TabsTrigger>
              <TabsTrigger value="ruo">Research Use Policy</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="refund">Refund Policy</TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-bold mb-6">Terms of Sale</h2>
              
              <div className="p-6 bg-destructive/10 border-2 border-destructive/30 rounded-lg mb-6">
                <p className="font-bold text-destructive mb-2">RESEARCH USE ONLY — CRITICAL NOTICE</p>
                <p className="text-sm">
                  All products sold by Amino's are for laboratory research use only. Not for human or veterinary use. 
                  Purchase confirms purchaser's acknowledgment of this policy.
                </p>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                By placing an order with Amino's, you agree to these Terms of Sale and confirm that all products 
                will be used exclusively for laboratory research purposes.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">2. Product Use Restrictions</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All products are manufactured and sold for research purposes only. The purchaser acknowledges:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Products are NOT for human consumption or medical use</li>
                <li>Products are NOT for veterinary use or animal treatment</li>
                <li>Products are intended for qualified researchers in controlled laboratory settings</li>
                <li>Misuse of products may result in legal consequences and account termination</li>
              </ul>

              <h3 className="text-xl font-semibold mt-8 mb-4">3. Age Requirement</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Purchasers must be 18 years of age or older (or the legal age of majority in their jurisdiction). 
                By purchasing, you confirm you meet this requirement.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">4. Payment Terms</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We accept PayPal for all transactions. Payment is due at the time of order placement. 
                Orders will not be processed until payment is confirmed.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">5. Pricing and Availability</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Prices are subject to change without notice. Product availability may vary. We reserve the right 
                to limit quantities or refuse service to any customer.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">6. Limitation of Liability</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Amino's is not responsible for any improper use of products. The purchaser assumes all risks 
                associated with product handling and use. Products are provided "as is" without warranty of any kind.
              </p>
            </TabsContent>

            <TabsContent value="ruo" className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-bold mb-6">Research Use Only Policy</h2>
              
              <div className="p-6 bg-destructive/10 border-2 border-destructive/30 rounded-lg mb-6">
                <p className="font-bold text-destructive mb-2">FOR LABORATORY RESEARCH ONLY</p>
                <p className="text-sm">
                  This policy outlines the strict limitations on product use. Violation of this policy may result 
                  in legal action and permanent account termination.
                </p>
              </div>

              <h3 className="text-xl font-semibold mt-8 mb-4">Purpose and Scope</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                All peptides and research compounds sold by Amino's are intended exclusively for laboratory research 
                applications. These products are manufactured for use by qualified researchers in controlled scientific 
                environments.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">Prohibited Uses</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The following uses are strictly prohibited:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Human consumption, ingestion, injection, or any form of human administration</li>
                <li>Use in medical diagnosis, treatment, cure, or prevention of disease in humans</li>
                <li>Veterinary use or administration to animals for treatment purposes</li>
                <li>Use in food products or dietary supplements</li>
                <li>Cosmetic applications or topical use on humans</li>
                <li>Any use outside of controlled laboratory research settings</li>
              </ul>

              <h3 className="text-xl font-semibold mt-8 mb-4">Purchaser Responsibilities</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                By purchasing from Amino's, you confirm that you understand and will comply with all restrictions. 
                You are responsible for proper handling, storage, and disposal of products according to applicable 
                regulations and laboratory safety protocols.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">Regulatory Compliance</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Products are not approved by the FDA, EMA, or any other regulatory authority for human or veterinary use. 
                Purchasers are responsible for ensuring compliance with all applicable local, state, national, and 
                international laws and regulations.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">Enforcement</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Amino's reserves the right to refuse service, cancel orders, and report suspected misuse to appropriate 
                authorities. We may request institutional verification or proof of qualified research status for any order.
              </p>
            </TabsContent>

            <TabsContent value="privacy" className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                Effective Date: {new Date().toLocaleDateString()}
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Name, email address, phone number</li>
                <li>Shipping and billing addresses</li>
                <li>Institutional affiliation (if provided)</li>
                <li>Payment information (processed securely through PayPal)</li>
                <li>Order history and communication records</li>
              </ul>

              <h3 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use collected information to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping notifications</li>
                <li>Respond to inquiries and provide customer support</li>
                <li>Verify compliance with our Research Use Only policy</li>
                <li>Improve our products and services</li>
                <li>Send promotional materials (you may opt out at any time)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-8 mb-4">Information Sharing</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We do not sell or rent your personal information to third parties. We may share information with 
                service providers (shipping carriers, payment processors) as necessary to complete your order, and 
                with law enforcement if required by law or to prevent misuse of our products.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">Data Security</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We implement appropriate security measures to protect your personal information. However, no method 
                of transmission over the internet is 100% secure.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">Cookies and Analytics</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We use cookies and similar technologies to improve your browsing experience and analyze site traffic. 
                You can control cookie preferences through your browser settings.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">Your Rights</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You have the right to access, correct, or delete your personal information. Contact us at 
                privacy@aminos.example to exercise these rights.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">GDPR Compliance</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                For EU residents, we comply with GDPR requirements. You have additional rights including data 
                portability and the right to object to processing.
              </p>
            </TabsContent>

            <TabsContent value="refund" className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-bold mb-6">Refund & Returns Policy</h2>
              
              <h3 className="text-xl font-semibold mt-8 mb-4">General Policy</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                All sales are final unless we ship the wrong product. Due to the sensitive nature of research 
                materials and contamination concerns, we cannot accept returns of opened or used products.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">Exceptions</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Refunds or replacements may be considered in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Wrong product shipped (contact us within 48 hours of receipt)</li>
                <li>Product arrives damaged (photo evidence required)</li>
                <li>Product does not meet specified purity standards (COA verification required)</li>
                <li>Order processing or shipping errors on our part</li>
              </ul>

              <h3 className="text-xl font-semibold mt-8 mb-4">Refund Request Process</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To request a refund or replacement:
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-6">
                <li>Contact support@aminos.example within 48 hours of receiving your order</li>
                <li>Provide your order number and detailed description of the issue</li>
                <li>Include clear photographs of the product and packaging if reporting damage</li>
                <li>Keep the product in its original sealed condition unless otherwise instructed</li>
              </ol>

              <h3 className="text-xl font-semibold mt-8 mb-4">Evaluation and Resolution</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                All refund requests are evaluated on a case-by-case basis. Amino's reserves the right to approve 
                or deny refund requests at our discretion. Approved refunds are typically processed within 7-10 
                business days and issued to the original payment method.
              </p>

              <h3 className="text-xl font-semibold mt-8 mb-4">Non-Refundable Circumstances</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Refunds will not be issued for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Change of mind or buyer's remorse</li>
                <li>Improper storage leading to product degradation</li>
                <li>User error in product selection or ordering</li>
                <li>Delayed claims (beyond 48-hour window)</li>
                <li>Products purchased for prohibited uses</li>
              </ul>

              <h3 className="text-xl font-semibold mt-8 mb-4">Contact Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                For refund inquiries, contact our support team at support@aminos.example or use our contact form. 
                Please include your order number and a detailed description of your concern.
              </p>
            </TabsContent>
          </Tabs>

          <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border">
            <h3 className="text-xl font-semibold mb-2">Questions About Our Policies?</h3>
            <p className="text-muted-foreground mb-4">
              If you have questions about any of our policies or need clarification, please don't hesitate to contact us.
            </p>
            <a 
              href="/contact" 
              className="text-primary font-medium hover:underline"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Legal;
