import { PaginatedResponse } from "../base-types";

// THese are for product listing cards

export interface ProductListing {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  price: string;
  originalPrice: string;
  isNew: boolean;
  isFeatured: boolean;
  isSale: boolean;
  offerEnds: string | null;
  forListing: boolean;
}

export interface ProductListingParams {
  page?: number;
  limit?: number;
}

export interface ProductApiResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<ProductListing>;
}

// These for getting single product by slug or id

export interface IProductColors {
  id: string;
  name: string;
  hex: string;
}

export interface IProductSizes {
  id: string;
  value: string;
}

export interface IBrands {
  id: string;
  name: string;
  image: string;
  storageKey: string;
  altText: string;
}

export interface ICategories {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  isActive: boolean;
  image: string;
  altText?: string;
}

export interface IMedia {
  id: string;
  url: string;
  altText: string;
}

export interface IImages {
  id: string;
  position: string;
  isPrimary: boolean;
  colorId: string;
  media: IMedia;
}

export interface IVariants {
  id: string;
  sku: string;
  price: string;
  stock: number;
  color: IProductColors | null;
  size: IProductSizes | null;
  colorId?: string;
  sizeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductTags {
  id: string;
}

export interface ITag {
  id: string;
  name: string;
  slug: string;
}

export interface ICategoriesApiResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<ICategories>;
}

export interface IBrandsApiResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<IBrands>;
}

export interface ITagsApiResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse<ITag>;
}

export interface ISpecifications {
  id: string;
  key: string;
  value: string;
  createdAt: string;
}

export interface IProductDetails {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  excerpt: string;
  description: string;
  price: string;
  originalPrice: string;
  offerEnds: Date | null;
  isSale: boolean;
  isFeatured: boolean;
  isNew: boolean;
  forListing: boolean;
  status: "ACTIVE" | "DRAFT" | "INACTIVE" | "ARCHIVED";

  colors: IProductColors[];
  sizes: IProductSizes[];
  brand: IBrands | null;
  category: ICategories | null;
  images: IImages[];
  variants: IVariants[];
  productTags: { createdAt: Date; tag: ITag }[];
  specification: ISpecifications[];

  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDetailsResponse {
  success: boolean;
  message: string;
  data: IProductDetails;
}
