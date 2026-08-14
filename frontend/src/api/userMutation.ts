import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "../store/userStore";
import { adminLoginAuth, login } from "../services/apiServices";
import { Admin, User } from "../constants/index.type";

const useLoginMutation = () => {
  const { setUser } = useUserStore();
  return useMutation({
    mutationFn: login,
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
