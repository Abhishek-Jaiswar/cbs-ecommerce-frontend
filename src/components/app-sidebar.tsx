"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { CompanyLogo } from "@/components/company-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
} from "lucide-react";

// This is sample data mapped to our backend modules.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <LineChart className="size-4" />,
      isActive: true,
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
          title: "Create Product",
          url: "/dashboard/products/create",
        },
        {
          title: "Inventory",
          url: "/dashboard/inventory",
        },
        {
          title: "Categories",
          url: "/dashboard/categories",
        },
        {
          title: "Brands",
          url: "/dashboard/brands",
        },
        {
          title: "Product Tags",
          url: "/dashboard/product-tags",
        },
        {
          title: "Media Library",
          url: "/dashboard/media",
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
      ],
    },
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
          url: "/dashboard/blog-tags",
        },
      ],
    },
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
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
