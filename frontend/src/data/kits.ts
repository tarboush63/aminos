
export interface Kit {
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

export const kits: Kit[] = [
 
 {
    id: "kit-007",
    name: "GLP-3 RT 30mg kit",
    sku: "AMN-reta-30MG",
    price: 149.99,
    dosage: "10 30mg vials",
    purity: "≥99% HLPC",
    form: "10 medical vial",
    storage: "store at room temperature",
    description: "High-purity research peptide for laboratory use",
    fullDescription: "GLP-3 RT is a high-quality research peptide supplied as vials. Manufactured under strict quality control with verified purity. Suitable for in vitro research applications only.",
    image: "@/assets/glp-rt30.jpg",
    coaFile: "coa-peptide-001.pdf",
    stock: false,
    leadTime: " 4 days",
    category: "Standard",
    featured: true
  },
  {
    id: "kit-007",
    name: "GLP-3 RT 10mg kit",
    sku: "AMN-P002-5MG",
    price: 499.99,
    dosage: "10 10mg vials",
    purity: "≥99% HPLC",
    form: "10 lab vials",
    storage: "Store at −20°C",
    description: "Premium research peptide for advanced studies",
    fullDescription: "Peptide-002 offers excellent purity for demanding research applications. Each vial contains 5mg of lyophilized peptide with comprehensive COA documentation.",
    image: "@/assets/reta10.jpg",
    coaFile: "coa-peptide-002.pdf",
    stock: false,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: true
  },
  {
    id: "kit-008",
    name: "GLP-2 TRZ 30mg kit",
    sku: "AMN-P003-10MG",
    price: 499.99,
    dosage: "10 30mg vials",
    purity: "≥99% HPLC",
    form: "10 medical vials",
    storage: "Store at −20°C",
    description: "High-capacity research peptide vial",
    fullDescription: "Peptide-003 provides a larger quantity for extended research programs. Manufactured with stringent quality controls and supplied with complete analytical documentation.",
    image: "@/assets/GLP2_TRZ30.jpg",
    coaFile: "coa-peptide-003.pdf",
    stock: false,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: false
  },
  {
    id: "kit-009",
    name: "GLOW 70mg kit",
    sku: "AMN-P004-2MG",
    price: 499.99,
    dosage: "10 2mg vial",
    purity: "≥99% HPLC",
    form: "10 medical vials",
    storage: "Store at −20°C",
    description: "Specialized research peptide for laboratory studies",
    fullDescription: "GLOW is optimized for specific research applications requiring high purity standards. Complete analytical documentation provided.",
    image: "@/assets/GLOW70.jpg",
    coaFile: "coa-peptide-004.pdf",
    stock: false,
    leadTime: "24-72 hours",
    category: "Specialized",
    featured: false
  },
  {
    id: "kit-010",
    name: "GLP-2 TRZ 60mg kit",
    sku: "AMN-P005-5MG",
    price: 899.99,
    dosage: "10 60mg vials",
    purity: "≥99% HPLC",
    form: "10 medical vials",
    storage: "Store at −20°C",
    description: "Ultra-high purity research peptide",
    fullDescription: "GLP-2 TRZ offers exceptional purity levels for critical research applications. Manufactured using advanced purification techniques with full traceability.",
    image: "@/assets/GLP2-TRZ.jpg",
    coaFile: "coa-peptide-005.pdf",
    stock: false,
    leadTime: "48-96 hours",
    category: "Premium",
    featured: true
  },
  {
    id: "kit-011",
    name: "NAD+ 500mg kit",
    sku: "AMN-P006-2MG",
    price: 499.99,
    dosage: "10 500 mg vials",
    purity: "≥99% HPLC",
    form: "10 medical vials",
    storage: "Store at −20°C",
    description: "Reliable research peptide for standard protocols",
    fullDescription: "NAD+ provides consistent quality for routine laboratory research. Each batch is thoroughly tested and documented.",
    image: "@/assets/nad1.jpg",
    coaFile: "coa-peptide-006.pdf",
    stock: false,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: false
  }
];
