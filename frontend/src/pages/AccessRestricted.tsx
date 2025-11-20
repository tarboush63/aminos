import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const AccessRestricted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl text-center">
        <ShieldAlert className="h-20 w-20 text-destructive mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Access Restricted</h1>
        <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
          This website contains information about research-grade peptides intended exclusively 
          for qualified researchers and laboratory use.
        </p>
        <div className="p-6 bg-muted/50 rounded-lg border border-border mb-8">
          <p className="text-muted-foreground leading-relaxed">
            Access to this site requires confirmation that you are of legal age and that all 
            products will be used strictly for laboratory research purposes, not for human 
            consumption, medical use, or veterinary applications.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you believe you've reached this page in error, please close this window.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.close()}
          >
            Close Window
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessRestricted;
