import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "../store/userStore";
import { adminLoginAuth, storeLogin } from "../services/apiServices";

const useLoginMutation = () => {
  const { setUser } = useUserStore();
  return useMutation({
    mutationFn: storeLogin,
    onSuccess: (data) => {
      setUser(data);
    },
  });
};

/// admin
const useAdminLoginMutation = () => {
  const { setUser } = useUserStore();
  return useMutation({
    mutationFn: adminLoginAuth,
    onSuccess: (data) => {
      setUser(data);
    },
  });
};

export { useLoginMutation, useAdminLoginMutation };
