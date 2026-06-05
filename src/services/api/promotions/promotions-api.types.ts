export interface ICoupon {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  perUserLimit: number | null;
  redeemedCount: number;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICouponRedemption {
  id: string;
  couponId: string;
  userId: string;
  orderId: string;
  codeSnapshot: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  discountAmount: number;
  createdAt: string;
  coupon?: {
    code: string;
    name: string;
  };
  user?: {
    name: string;
    email: string;
  };
  order?: {
    orderNumber: string;
  };
}

export interface IOffer {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  priority: number;
  products?: {
    productId: string;
    product?: {
      name: string;
    };
  }[];
  categories?: {
    categoryId: string;
    category?: {
      name: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ISingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IValidateCouponPayload {
  code: string;
  orderAmount: number;
}

export interface IValidateCouponResult {
  couponId: string;
  code: string;
  name: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  discountAmount: number;
}
