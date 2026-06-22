"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { CompanyLogo } from "@/components/company-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Settings2Icon,
  Package2,
  Users,
  MessageSquare,
  ShoppingCart,
  Percent,
  LineChart,
  FileText,
  Boxes,
} from "lucide-react";

// This is structured data mapped to our backend modules.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navCore: [
    {
      title: "Dashboard",
      url: "#",
      icon: <LineChart className="size-4" />,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
      ],
    },
    {
      title: "Products & Catalog",
      url: "#",
      icon: <Package2 className="size-4" />,
      items: [
        {
          title: "All Products",
          url: "/dashboard/products",
        },
        {
          title: "Brands",
          url: "/dashboard/brands",
        },
        {
          title: "Categories",
          url: "/dashboard/categories",
        },
        {
          title: "Product Tags",
          url: "/dashboard/product-tags",
        },
        {
          title: "Create Product",
          url: "/dashboard/products/create",
        },
        // {
        //   title: "Media Library",
        //   url: "/dashboard/media",
        // },
      ],
    },
    {
      title: "Inventory & Supply",
      url: "#",
      icon: <Boxes className="size-4" />,
      items: [
        {
          title: "Stock Levels",
          url: "/dashboard/inventory",
        },
        {
          title: "Audit Ledger",
          url: "/dashboard/inventory/ledger",
        },
        {
          title: "Purchase Orders",
          url: "/dashboard/inventory/purchase-orders",
        },
        {
          title: "Suppliers",
          url: "/dashboard/inventory/suppliers",
        },
        {
          title: "Warehouses",
          url: "/dashboard/inventory/warehouses",
        },
      ],
    },
    {
      title: "Sales & Operations",
      url: "#",
      icon: <ShoppingCart className="size-4" />,
      items: [
        {
          title: "All Orders",
          url: "/dashboard/orders",
        },
        {
          title: "Payments",
          url: "/dashboard/payments",
        },
        {
          title: "Sales & ROI Reports",
          url: "/dashboard/sales-reports",
        },
        {
          title: "Analytical Reports",
          url: "/dashboard/reports",
        },
        {
          title: "Download Center",
          url: "/dashboard/reports/download-center",
        },
      ],
    },
  ],
  navMarketing: [
    {
      title: "Marketing",
      url: "#",
      icon: <Percent className="size-4" />,
      items: [
        {
          title: "Coupons",
          url: "/dashboard/coupons",
        },
        {
          title: "Promotional Offers",
          url: "/dashboard/offers",
        },
        {
          title: "Coupon Redemptions",
          url: "/dashboard/offers/redemptions",
        },
        {
          title: "Announcements",
          url: "/dashboard/announcements",
        },
      ],
    },
    {
      title: "Blog CMS",
      url: "#",
      icon: <FileText className="size-4" />,
      items: [
        {
          title: "All Posts",
          url: "/dashboard/blog/posts",
        },
        {
          title: "Create Post",
          url: "/dashboard/blog/posts/create",
        },
        {
          title: "Blog Categories",
          url: "/dashboard/blog/categories",
        },
        {
          title: "Blog Tags",
          url: "/dashboard/blog/tags",
        },
      ],
    },
    {
      title: "Content & Feedback",
      url: "#",
      icon: <MessageSquare className="size-4" />,
      items: [
        {
          title: "Reviews",
          url: "/dashboard/reviews",
        },
      ],
    },
  ],
  navAdmin: [
    {
      title: "User Management",
      url: "#",
      icon: <Users className="size-4" />,
      items: [
        {
          title: "Customers",
          url: "/dashboard/users",
        },
        {
          title: "Addresses",
          url: "/dashboard/addresses",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon className="size-4" />,
      items: [
        {
          title: "General Settings",
          url: "/dashboard/settings",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Core Operations" items={data.navCore} />
        <NavMain label="Marketing & CMS" items={data.navMarketing} />
        <NavMain label="Administration" items={data.navAdmin} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
