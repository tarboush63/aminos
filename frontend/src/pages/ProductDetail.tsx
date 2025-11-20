// src/pages/ProductDetail.tsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products } from "@/data/products";
import { ShoppingCart, FileText, AlertCircle, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";

/** Normalize whatever is in product.image into a runtime src:
 * - remote URL => returned as-is
 * - absolute public path (/images/...) => returned as-is
 * - aliased path "@/assets/foo.jpg" or bare filename "foo.jpg" => /images/foo.jpg
 * - missing => /images/placeholder.png
 */
function normalizeImagePath(image?: string | null): string {
  const placeholder = "/images/nad1.jpg";
  if (!image) return placeholder;
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) return image;
  // basename handles "@/assets/foo.jpg", "src/assets/foo.jpg", "foo.jpg"
  const basename = image.replace(/^.*[\\/]/, "");
  return basename ? `/images/${basename}` : placeholder;
}

const ProductDetail = () => {
  const params = useParams<{ id?: string }>();
  const id = params.id;
  const product = id ? products.find((p) => String(p.id) === String(id)) : undefined;
  const { addItem } = useCart();

  const defaultImg = "/images/nad1.jpg";
  const [imgSrc, setImgSrc] = useState(() => normalizeImagePath(product?.image));

  const handleAddToCart = (product: any) => {
    if (!product) {
      console.warn("handleAddToCart called with undefined product");
      return;
    }
    addItem(
      {
        id: String(product.id),
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image,
        sku: product.sku,
      },
      1
    );
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">
              No product matches the id <strong>{id ?? "(missing id)"}</strong>. Check your product links and routes.
            </p>
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                <img
                  src={imgSrc}
                  alt={`${product.name} - ${product.dosage}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={() => setImgSrc(defaultImg)}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                {/* <div className="flex items-start justify-between mb-2">
                  <h1 className="text-4xl font-bold">{product.name}</h1>
                  <span className="ruo-badge">RUO</span>
                </div> */}
                <p className="text-muted-foreground">SKU: {product.sku}</p>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold">${product.price}</span>
                {product.stock ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              <div className="space-y-3 py-4 border-y border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dosage:</span>
                  <span className="font-medium">{product.dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purity:</span>
                  <span className="font-medium">{product.purity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Form:</span>
                  <span className="font-medium">{product.form}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage:</span>
                  <span className="font-medium">{product.storage}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Lead Time:</span>
                  <span className="font-medium">{product.leadTime}</span>
                </div> */}
              </div>

              <div className="flex gap-4">
                <Button onClick={() => handleAddToCart(product)} className="flex-1 btn-gold h-12 text-base" disabled={!product.stock}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button asChild variant="outline" className="h-12 px-6">
                  <Link to="/contact">Request Bulk Quote</Link>
                </Button>
              </div>

              <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive mb-1">Not for Human Consumption</p>
                  <p className="text-sm text-muted-foreground">This product is for research use only. Not for human or veterinary use.</p>
                </div>
              </div>

              <Button variant="outline" className="w-full" asChild>
                <a href={`/coa/${product.coaFile}`} download>
                  <FileText className="mr-2 h-4 w-4" /> Download COA (Certificate of Analysis)
                </a>
              </Button>
            </div>
          </div>

          {/* Tabs unchanged */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
