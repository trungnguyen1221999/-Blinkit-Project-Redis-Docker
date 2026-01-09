export interface UserInterface {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  mobile?: string | null;
  refreshToken?: string;
  verify_email?: boolean;
  last_login_date?: Date | null;
  status?: "Active" | "Inactive" | "Suspended";
  address_detail?: string | null; // ID tham chiếu
  shopping_cart?: string[]; // danh sách ID cartProduct
  orderHistory?: string[]; // danh sách ID order
  forgot_password_opt?: string | null;
  forgot_password_expiry?: Date | null;
  role?: "ADMIN" | "USER";
}
