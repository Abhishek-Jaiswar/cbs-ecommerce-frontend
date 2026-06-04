export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductReview = {
  id: number;
  author: string;
  date: string;
  rating: number;
  avatar: string;
  comment: string;
};

export type Product = {
  id: number;
  name: string;
  brand: string;
  reviewCount: number;
  price: number;
  originalPrice: number | null;
  stock: number;
  offerEnds: string;
  description: string;
  longDescription: string;
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  information: {
    colors: string[];
    sizes: string[];
  };
  reviews: ProductReview[];
};
