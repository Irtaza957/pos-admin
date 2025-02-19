export const API_ROUTES = {
  BASE_URL: `${process.env.NEXT_PUBLIC_BASE_API_URL}/admin/`,
  URL: process.env.NEXT_PUBLIC_BASE_API_URL,
  getCategory: "/categories",
  postCategory: "/category",
  deleteCategory: "/category/",

  getSubCategory: "/subcategories",
  postSubCategory: "/subcategory",
  deleteSubCategory: "/subcategory/",
  getProduct: "/products",
  postProducts: "/product",
  deleteProduct: "/product/",
  postProductImage: "storage/product/image",
  getStore: "/branches",
  getBranchEmployees: "/branchEmployees/",
  addBranch: "/branch",

  getOrder: "/orders",
  postOrders: "/orders",
  orderStatus: "/orderStatus",

  getCustomer: "/customers",
  postCustomer: "/customer",
  deleteCustomer: "/customer/",
  updateCustomer: "/customer/",
  updateCustomerStatus: "/customer/updateBlackList/",

  getEmployees: "/employees",
  addEmployee: "/employee",

  storage: "storage",

  REFRESH_TOKEN: "/auth/refresh",

  getUserInfo: "/me",
};
