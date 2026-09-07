export type UserLoginProps = {
  email: string;
  password: string;
};

export type UserRole = "ADMIN" | "STORE" | "CUSTOMER";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  branchId?: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: User;
};
