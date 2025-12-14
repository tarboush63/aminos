// src/components/ProductCard.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Kit } from "@/data/kits";
import { useState } from "react";

interface ProductCardProps {
  product: Kit;
}

/** same normalizer as ProductDetail: ensures any product.image value resolves to a public path or remote URL */
function normalizeImagePath(image?: string | null): string {
  const placeholder = "/images/nad1.jpg";
  if (!image) return placeholder;
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) return image;
  const basename = image.replace(/^.*[\\/]/, "");
  return basename ? `/images/${basename}` : placeholder;
}

export const KitCard = ({ product }: ProductCardProps) => {
  const defaultImg = "/images/nad1.jpg";
  const initial = normalizeImagePath(product?.image);
  const [imgSrc, setImgSrc] = useState(initial);

  return (
    <div className="card-product group">
      <Link to={`/kit/${product.id}`} className="block mb-4">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={imgSrc}
            alt={`${product.name} - ${product.dosage}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc(defaultImg)}
          />
        </div>
      </Link>

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <Link to={`/kit/${product.id}`}>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">{product.dosage}</p>
          </div>
          {product.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{product.purity}</p>
          <p className="text-sm text-muted-foreground">{product.form}</p>
        </div>
                {/* Price display */}
               <div className="pt-2">
          {/* <span className="text-2xl font-bold text-primary">${product.price?.toFixed(2)}</span>
          <span className="text-2xl font-bold text-primary">${product.price?.toFixed(2)}</span> */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-red-600">
              ${product.price.toFixed(2)}
            </span>

            <span className="text-sm line-through text-muted-foreground">
              ${Number(product.price*1.2).toFixed(2)}
            </span>

            <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded">
              -20%
            </span>
          </div>
        </div>

        {/* <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold">${product.price}</span>
          <span className="ruo-badge text-[10px]">RUO</span>
        </div> */}

        <div className="flex gap-2 pt-2">
          <Button asChild className="flex-1 btn-gold">
            <Link to={`/kit/${product.id}`}>Buy Now</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link to={`/kit/${product.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
