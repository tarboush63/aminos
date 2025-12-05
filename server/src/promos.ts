// server/src/promos.ts
import fs from "fs";
import path from "path";

export type Promo = {
  code: string;
  type: "percent" | "fixed" | "free_shipping";
  amount: number;
  currency?: string;
  minTotal?: number;
  expiresAt?: string | null;
  description?: string;
};

const PROMOS_FILE = process.env.PROMOS_FILE || path.join(__dirname, "..", "promos.json");

let cachedPromos: Promo[] | null = null;

function readPromosFile(): Promo[] {
  if (cachedPromos) return cachedPromos;
  if (process.env.PROMOS_JSON) {
    try {
      cachedPromos = JSON.parse(process.env.PROMOS_JSON) as Promo[];
      return cachedPromos;
    } catch (err) {
      console.warn("Invalid PROMOS_JSON env var, falling back to file:", err);
    }
  }
  if (!fs.existsSync(PROMOS_FILE)) {
    cachedPromos = [];
    return cachedPromos;
  }
  const raw = fs.readFileSync(PROMOS_FILE, "utf-8");
  cachedPromos = JSON.parse(raw) as Promo[];
  return cachedPromos;
}

export function getPromoByCode(code?: string): Promo | null {
  if (!code) return null;
  const promos = readPromosFile();
  const search = code.trim().toUpperCase();
  return promos.find(pr => pr.code.toUpperCase() === search) || null;
}

export function computeDiscount(promo: Promo, total: number) {
  let discountAmount = 0;
  let freeShipping = false;
  if (promo.type === "percent") {
    discountAmount = Math.round((total * (promo.amount / 100)) * 100) / 100;
  } else if (promo.type === "fixed") {
    discountAmount = Number(promo.amount) || 0;
  } else if (promo.type === "free_shipping") {
    discountAmount = 0;
    freeShipping = true;
  }
  discountAmount = Math.max(0, Math.min(discountAmount, total));
  const newTotal = Math.round((total - discountAmount) * 100) / 100;
  return { discountAmount, newTotal, freeShipping };
}

export function validatePromoForOrder(code: string | undefined, total: number, currency?: string) {
  if (!code) return { valid: false, reason: "No promo code provided" };
  const promo = getPromoByCode(code);
  if (!promo) return { valid: false, reason: "Invalid promo code" };

  if (promo.currency && currency && promo.currency.toLowerCase() !== currency.toLowerCase()) {
    return { valid: false, reason: "Promo not valid for currency" };
  }

  if (promo.minTotal && total < promo.minTotal) {
    return { valid: false, reason: `Requires minimum total of ${promo.minTotal}` };
  }

  if (promo.expiresAt) {
    const exp = new Date(promo.expiresAt);
    if (isNaN(exp.getTime()) || exp.getTime() < Date.now()) {
      return { valid: false, reason: "Promo expired" };
    }
  }

  const { discountAmount, newTotal, freeShipping } = computeDiscount(promo, total);

  return { valid: true, promo, discountAmount, newTotal, freeShipping };
}
