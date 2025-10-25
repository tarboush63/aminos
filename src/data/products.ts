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
    fullDescription: "GLP-3 RT is a high-quality research peptide supplied as vials. Manufactured under strict quality control with verified purity. Suitable for in vitro research applications only.",
    image: "@/assets/glp-rt30.jpg",
    coaFile: "coa-peptide-001.pdf",
    stock: true,
    leadTime: " 4 days",
    category: "Standard",
    featured: true
  },
  {
    id: "peptide-002",
    name: "GLP-3 RT",
    sku: "AMN-P002-5MG",
    price: 279.99,
    dosage: "10 mg vial",
    purity: "≥99% HPLC",
    form: "lab vial",
    storage: "Store at −20°C",
    description: "Premium research peptide for advanced studies",
    fullDescription: "Peptide-002 offers excellent purity for demanding research applications. Each vial contains 5mg of lyophilized peptide with comprehensive COA documentation.",
    image: "@/assets/reta10.jpg",
    coaFile: "coa-peptide-002.pdf",
    stock: true,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: true
  },
  {
    id: "peptide-003",
    name: "Peptide-003",
    sku: "AMN-P003-10MG",
    price: 499.99,
    dosage: "10 mg vial",
    purity: "≥98% HPLC",
    form: "Lyophilized powder",
    storage: "Store at −20°C",
    description: "High-capacity research peptide vial",
    fullDescription: "Peptide-003 provides a larger quantity for extended research programs. Manufactured with stringent quality controls and supplied with complete analytical documentation.",
    image: "@/assets/reta30.jpg",
    coaFile: "coa-peptide-003.pdf",
    stock: true,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: false
  },
  {
    id: "peptide-004",
    name: "Peptide-004",
    sku: "AMN-P004-2MG",
    price: 169.99,
    dosage: "2 mg vial",
    purity: "≥97% HPLC",
    form: "Lyophilized powder",
    storage: "Store at −20°C",
    description: "Specialized research peptide for laboratory studies",
    fullDescription: "Peptide-004 is optimized for specific research applications requiring high purity standards. Complete analytical documentation provided.",
    image: "@/assets/GLOW70.jpg",
    coaFile: "coa-peptide-004.pdf",
    stock: true,
    leadTime: "24-72 hours",
    category: "Specialized",
    featured: false
  },
  {
    id: "peptide-005",
    name: "Peptide-005",
    sku: "AMN-P005-5MG",
    price: 299.99,
    dosage: "5 mg vial",
    purity: "≥99% HPLC",
    form: "Lyophilized powder",
    storage: "Store at −20°C",
    description: "Ultra-high purity research peptide",
    fullDescription: "Peptide-005 offers exceptional purity levels for critical research applications. Manufactured using advanced purification techniques with full traceability.",
    image: "@/assets/GLP2-TRZ.jpg",
    coaFile: "coa-peptide-005.pdf",
    stock: true,
    leadTime: "48-96 hours",
    category: "Premium",
    featured: true
  },
  {
    id: "peptide-006",
    name: "Peptide-006",
    sku: "AMN-P006-2MG",
    price: 159.99,
    dosage: "2 mg vial",
    purity: "≥96% HPLC",
    form: "Lyophilized powder",
    storage: "Store at −20°C",
    description: "Reliable research peptide for standard protocols",
    fullDescription: "Peptide-006 provides consistent quality for routine laboratory research. Each batch is thoroughly tested and documented.",
    image: "@/assets/GLP2_TRZ30.jpg",
    coaFile: "coa-peptide-006.pdf",
    stock: true,
    leadTime: "24-72 hours",
    category: "Standard",
    featured: false
  },
  {
    id: "peptide-007",
    name: "Peptide-007",
    sku: "AMN-P007-5MG",
    price: 319.99,
    dosage: "5 mg vial",
    purity: "≥98% HPLC",
    form: "Lyophilized powder",
    storage: "Store at −20°C",
    description: "Advanced research peptide for complex studies",
    fullDescription: "Peptide-007 is designed for sophisticated research protocols requiring high purity and stability. Complete quality documentation included.",
    image: "@/assets/hero-lab.jpg",
    coaFile: "coa-peptide-007.pdf",
    stock: true,
    leadTime: "24-72 hours",
    category: "Specialized",
    featured: false
  },
  {
    id: "peptide-008",
    name: "Peptide-008",
    sku: "AMN-P008-10MG",
    price: 549.99,
    dosage: "10 mg vial",
    purity: "≥99% HPLC",
    form: "Lyophilized powder",
    storage: "Store at −20°C",
    description: "Premium high-capacity research peptide",
    fullDescription: "Peptide-008 combines ultra-high purity with large quantity for extensive research programs. Manufactured under the strictest quality standards.",
    image: "@/assets/aminoLogo.jpg",
    coaFile: "coa-peptide-008.pdf",
    stock: true,
    leadTime: "48-96 hours",
    category: "Premium",
    featured: true
  }
];
