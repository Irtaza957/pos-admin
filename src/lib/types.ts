export type CustomerType = {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders?: number;
  lastOrderId?: string;
};

export type CustomerFilterType = {
  name: string;
  phone_number: string;
  email: string;
  last_order_date: string;
  status: string;
  withDeleted: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  image: string;
  restaurant_id: string;
  category_id: string;
  sub_category_id: string;
  quantity: number;
};

export type ProductFilterType = {
  name: string;
  price: string;
  category: string;
  date: string;
  withDeleted: string;
  orderStatus: string;
};

export type CategoryFilterType = {
  name: string;
  date: string;
  withDeleted?: string;
};

export type CategoryType = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  category_id?: string;
};

export type BranchEmployeeType = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: boolean;
  restaurant_id: string;
  phone_number: string;
  email: string;
  password: string;
  image: string;
  job_title: string;
  username: string;
  imageObject: {
    id: string;
  };
};

export type BranchType = {
  id: string;
  name: string;
  location: string;
  status: boolean;
  website?: string;
  logo: string;
};

export type EmployeeType = {
  id: string;
  name: string;
  job_title: string;
  department: string;
  status: boolean;
};

export type OrderType = {
  id: string;
  customer_name: string;
  tax_percent: number;
  total: number;
  orderStatus: string;
  store: {
    id: string;
    name: string;
  };
};

export type RoleType = {
  label: string;
  value: string;
};

export type OrderFilterType = {
  id?: string;
  name: string;
  store: string;
  price: string;
  status: string;
  date: string;
  orderStatus: string;
};
