import { Admin, LoginResponse } from "../constants/index.type";
import { BranchResponse } from "../types/type";

export const BASE_URL = "http://localhost:8000/api";

export const apiFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
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
    throw new Error("AUTHENTICATION_REQUIRED");
  }

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data.data || data;
};

const login = async (data: Admin) => {
  try {
    const res = await fetch(`${BASE_URL}/user/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(responseData?.message || "Invalid email or password");
    }
    return responseData;
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

const getBranch = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/branches/${id}`);
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

const adminCreateAuth = async (data: Admin) => {
  try {
    return apiFetch(`${BASE_URL}/admin/sign-up`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

const adminLoginAuth = async (data: Admin): Promise<LoginResponse> => {
  try {
    return apiFetch("/admin/sign-in", {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

const getGroups = async () => {
  try {
    return apiFetch("/admin/groups");
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

const getGroup = async (id: string): Promise<BranchResponse> => {
  try {
    return apiFetch(`/admin/groups/${id}`);
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong");
  }
};

export {
  login,
  getBranches,
  getBranch,
  getProducts,
  getGroups,
  getGroup,
  adminCreateAuth,
  adminLoginAuth,
};
