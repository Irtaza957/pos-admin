import { LayoutGrid, Layers, Package, ShoppingCart, User, Split, ChartBarStacked, type LucideIcon, Users } from "lucide-react";

export interface NavConfigItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const productTabs = ["All", "Active", "Inactive", "Delete"];
export const categoryTabs = ["All", "Delete"];
export const orderTabs = ["All", "Today", "Pending", "Completed", "Canceled"];
export const customerTabs = ["All", "Blocklisted", "Deleted"];
export const itemsPerPageOptions = [5, 10, 20, 50];

export const customerHeaders = [
  { key: "", label: "#" },
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "totalOrders", label: "Total Order" },
  { key: "last_order_id", label: "Last Order" },
  { key: "actions", label: "Actions" },
];

export const roles = [
  { label: "CASHIER", value: "cashier" },
  { label: "SUPERVISOR", value: "supervisor" },
];

export const navConfig: NavConfigItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutGrid,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Layers,
  },
  {
    title: "Subcategories",
    href: "/subcategories",
    icon: ChartBarStacked,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: User,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Branches",
    href: "/branches",
    icon: Split,
  },
];
