export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  dosage: string;
  purity: string;
  form: string;
  storage: string;
  description: string;
  fullDescription: string;
  image: string;
  coaFile: string;
  stock: boolean;
  leadTime: string;
  category: string;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "peptide-001",
    name: "GLP-3 RT 30mg",
    sku: "AMN-reta-30MG",
    price: 149.99,
    dosage: "30 mg vial",
    purity: "≥99% HLPC",
    form: "medical vial",
    storage: "store at room temperature",
    description: "High-purity research peptide for laboratory use",
    fullDescription: "GLP-3 RT is a ≥99% pure triple-agonist peptide targeting GLP-1, GIP, and glucagon receptors. Designed for advanced metabolic research, it delivers unmatched consistency, verified purity, and dependable performance backed by third-party COA certification",
    image: "@/assets/glp-rt30.jpg",
    coaFile: "coa-peptide-001.pdf",
    stock: true,
    leadTime: " 4 days",
    category: "Featured",
    featured: true
  },
  {
    id: "peptide-002",
    name: "GLP-3 RT 10mg",
    sku: "AMN-P002-5MG",
    price: 59.99,
    dosage: "10 mg vial",
    purity: "≥99% HPLC",
    form: "medical vial",
    storage: "Store at −20°C",
    description: "Premium research peptide for advanced studies",
    fullDescription: "GLP-3 RT is a ≥99% pure triple-agonist peptide targeting GLP-1, GIP, and glucagon receptors. Designed for advanced metabolic research, it delivers unmatched consistency, verified purity, and dependable performance backed by third-party COA certification.",
    image: "@/assets/reta10.jpg",
    coaFile: "coa-peptide-002.pdf",
    stock: true,
    leadTime: "24-72 hours",
    category: "Featured",
    featured: true
  },
  {
    id: "peptide-003",
    name: "GLP-2 TRZ 30mg",
    sku: "AMN-P003-10MG",
    price: 69.99,
    dosage: "30 mg vial",
    purity: "≥99% HPLC",
    form: "medical vial",
    storage: "Store at −20°C",
    description: "High-capacity research peptide vial",
    fullDescription: "GLP-3 RT is a ≥99% pure triple-agonist peptide targeting GLP-1, GIP, and glucagon receptors. Designed for advanced metabolic research, it delivers unmatched consistency, verified purity, and dependable performance backed by third-party COA certification.",
    image: "@/assets/GLP2_TRZ30.jpg",
    coaFile: "coa-peptide-003.pdf",
    stock: false,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: false
  },
  {
    id: "peptide-004",
    name: "GLOW 70mg",
    sku: "AMN-P004-2MG",
    price: 59.99,
    dosage: "70 mg vial",
    purity: "≥99% HPLC",
    form: "medical vial",
    storage: "Store at −20°C",
    description: "Specialized research peptide for laboratory studies",
    fullDescription: "GLOW is a ≥99% pure synergistic peptide formulation designed for advanced research on regeneration, tissue recovery, and cellular repair. Crafted for precision and reliability, it ensures consistent results and verified purity backed by third-party COA certification",
    image: "@/assets/GLOW70.jpg",
    coaFile: "coa-peptide-004.pdf",
    stock: false,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: false
  },
  {
    id: "peptide-005",
    name: "GLP-2 TRZ 60mg",
    sku: "AMN-P005-5MG",
    price: 119.99,
    dosage: "60 mg vial",
    purity: "≥99% HPLC",
    form: "medical vial",
    storage: "Store at −20°C",
    description: "Ultra-high purity research peptide",
    fullDescription: "GLP-2 TRZ is a ≥99% pure dual-agonist peptide targeting GLP-1 and GIP receptors. Designed for advanced metabolic research, it delivers exceptional purity, reliability, and reproducibility. Each batch verified by third-party COA certification",
    image: "@/assets/GLP2-TRZ.jpg",
    coaFile: "coa-peptide-005.pdf",
    stock: true,
    leadTime: "48-96 hours",
    category: "Featured",
    featured: true
  },
  {
    id: "peptide-006",
    name: "NAD+ 500mg",
    sku: "AMN-P006-2MG",
    price: 59.99,
    dosage: "500 mg vial",
    purity: "≥99% HPLC",
    form: "medical vial",
    storage: "Store at −20°C",
    description: "Reliable research peptide for standard protocols",
    fullDescription: "NAD+ is a ≥99% pure, research-grade coenzyme essential for studies on cellular energy, mitochondrial function, and DNA repair. Supplied as a lyophilized powder for maximum stability, each batch is verified by third-party COA certification to ensure unmatched purity and consistency in every experiment.",
    image: "@/assets/nad1.jpg",
    coaFile: "coa-peptide-006.pdf",
    stock: false,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: false
  },
   {
    id: "peptide-006",
    name: "BAC Water 3 ml",
    sku: "AMN-P006-2MG",
    price: 4.99,
    dosage: "3 ml vial",
    purity: "≥99% HPLC",
    form: "medical vial",
    storage: "Store at −20°C",
    description: "Reliable research peptide for standard protocols",
    fullDescription: "BAC Water is a ≥99% pure, research-grade sterile diluent essential for studies requiring precise reconstitution and controlled solution preparation. Supplied as sterile, bacteriostatic water for maximum stability, each batch is verified by third-party COA certification to ensure unmatched purity and consistency in every experiment.",
    image: "@/assets/bac3.jpg",
    coaFile: "coa-peptide-006.pdf",
    stock: false,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: false
  },
   {
    id: "peptide-006",
    name: "BAC Water 30 ml",
    sku: "AMN-P006-2MG",
    price: 29.99,
    dosage: "30 ml vial",
    purity: "≥99% HPLC",
    form: "medical vial",
    storage: "Store at −20°C",
    description: "Reliable research peptide for standard protocols",
    fullDescription: "BAC Water is a ≥99% pure, research-grade sterile diluent essential for studies requiring precise reconstitution and controlled solution preparation. Supplied as sterile, bacteriostatic water for maximum stability, each batch is verified by third-party COA certification to ensure unmatched purity and consistency in every experiment.",
    image: "@/assets/bac30.jpg",
    coaFile: "coa-peptide-006.pdf",
    stock: false,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: false
  }
];
