import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldAlert } from "lucide-react";

const AGE_GATE_COOKIE = "aminos_age_ruo_confirmed";

export const AgeGateModal = () => {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const hasConfirmed = localStorage.getItem(AGE_GATE_COOKIE);
    if (!hasConfirmed) {
      setOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    if (!confirmed) return;
    
    // Set cookie for 30 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    localStorage.setItem(AGE_GATE_COOKIE, "true");
    localStorage.setItem("aminos_age_ruo_expiry", expiryDate.toISOString());
    
    setOpen(false);
  };

  const handleDecline = () => {
    window.location.href = "/access-restricted";
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] [&>button]:hidden" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto mb-4">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Age & Research-Use Only Confirmation
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed pt-4 text-center">
            I confirm that I am 18 years or older (or legal adult in my country) AND I will use all purchased materials strictly for laboratory research purposes.
          </DialogDescription>
          <DialogDescription className="text-base leading-relaxed pt-2 text-center font-semibold">
            I confirm these products are NOT for human consumption, medical use, or veterinary use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="flex items-start space-x-3 border border-border rounded-lg p-4">
            <Checkbox 
              id="confirm" 
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="confirm"
              className="text-sm leading-relaxed cursor-pointer select-none"
            >
              I confirm that I meet the age requirement and will use all products exclusively for laboratory research purposes, not for human consumption, medical use, or veterinary applications.
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleConfirm}
              disabled={!confirmed}
              className="flex-1 btn-gold h-12 text-base font-semibold"
            >
              Continue to Site
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1 h-12 text-base"
            >
              I Do Not Agree
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          By clicking "Continue to Site" you acknowledge that you have read and agreed to our Research Use Only policy.
        </p>
      </DialogContent>
    </Dialog>
  );
};
