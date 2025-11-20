import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about our products and services
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                Are these peptides for human use?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                No. All products sold by Amino's are for laboratory research use only. They are not for human consumption, 
                medical use, or veterinary applications. By purchasing, you confirm your understanding and agreement with 
                this policy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                Do you provide Certificates of Analysis (COAs)?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes — COAs are available for download on each product page and are included with your order. 
                Each COA is lot-specific and includes HPLC purity verification and other quality control data.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Currently, we accept PayPal for all transactions. PayPal provides secure payment processing with 
                buyer protection. Additional payment gateways may be added in the future.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What are your shipping times and regions?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Typical processing time is 24-72 hours for most products. Some premium items may require 48-96 hours. 
                Shipping times depend on your location and chosen carrier. We ship to most regions - contact us if you 
                have specific shipping questions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What is your refund and return policy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                All sales are final unless we ship the wrong product. If you believe there's an issue with your order, 
                contact support within 48 hours of receipt. Refund requests require photo evidence and are evaluated 
                on a case-by-case basis at Amino's discretion.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                How should I store the peptides?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                All our peptides should be stored at −20°C (minus twenty degrees Celsius) in their original sealed vials. 
                Specific storage instructions are included on each product page and with your shipment. Proper storage 
                ensures product stability and longevity.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                Do you offer bulk pricing or institutional accounts?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes, we can accommodate bulk orders and institutional purchasing. Please use the "Request Bulk Quote" 
                button on product pages or contact us directly with your requirements. We can work with purchase orders 
                and may offer volume discounts for qualified research institutions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                How do I verify the authenticity of my product?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Each product comes with a lot-specific COA (Certificate of Analysis) that you can download from our 
                website. The COA includes HPLC purity data and other quality control information. The lot number on 
                your product vial should match the lot number on the COA.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Our support team is here to help.
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

export default FAQ;
