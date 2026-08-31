import { LoginResponse, UserLoginProps } from "../constants/index.type";
import { useUserStore } from "../store/userStore";
import { Branches, BranchDetails, Groups, BrandProducts } from "../types/type";
import { isTokenValid } from "../utils/token";

export const BASE_URL = "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export const apiFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  // --- "request interceptor" ---
  // Guard before the request even goes out: if we have a user but their
  // token has expired, clear the stale state first. credentials: "include"
  // means the actual auth is the httpOnly cookie, so this doesn't block
  // the request — it just keeps client-side user state honest so the UI
  // doesn't show someone as "logged in" with a dead session.
  const { user, clearUser } = useUserStore.getState();
  if (user && !isTokenValid(user.token)) {
    clearUser();
  }
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    useUserStore.getState().clearUser();
    throw new Error("AUTHENTICATION_REQUIRED");
  }

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    const message = await response
      .json()
      .then((data) => data?.message ?? response.statusText)
      .catch(() => response.statusText);
    throw new ApiError(response.status, message);
  }

  return data.data || data;
};

const storeLogin = async (data: UserLoginProps): Promise<LoginResponse> => {
  try {
    return apiFetch("/store/sign-in", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

const getBranches = async () => {
  try {
    const res = await fetch(`${BASE_URL}/branches`);
    const responseData = await res.json();
    // console.log(responseData);

    if (!res.ok) {
      throw new Error(responseData?.message || "Failed to fetch branches");
    }
    return responseData;
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

const getBranch = async (id: string): Promise<BranchDetails> => {
  try {
    return apiFetch(`/branches/${id}`);
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

const getProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const responseData = await res.json();
    console.log(responseData);

    if (!res.ok) {
      throw new Error(responseData?.message || "Failed to fetch branches");
    }
    return responseData;
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

//// ADMIN

const adminCreateAuth = async (data: UserLoginProps) => {
  try {
    return apiFetch(`${BASE_URL}/admin/sign-up`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

const adminLoginAuth = async (data: UserLoginProps): Promise<LoginResponse> => {
  try {
    return apiFetch("/admin/sign-in", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

const getGroups = async (): Promise<Groups[]> => {
  try {
    return apiFetch("/admin/groups");
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

const getBranchByGroupId = async (id: string): Promise<Branches> => {
  try {
    return await apiFetch(`/admin/groups/branches/${id}`);
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

const getProductByGroupId = async (id: string): Promise<BrandProducts> => {
  try {
    return await apiFetch(`/admin/groups/products/${id}`); // ← await added
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

export {
  storeLogin,
  getBranches,
  getBranch,
  getProducts,
  getGroups,
  getBranchByGroupId,
  getProductByGroupId,
  adminCreateAuth,
  adminLoginAuth,
};
