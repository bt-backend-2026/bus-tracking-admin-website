import { loginUser } from "@bustrack/api-client/services/auth-service";
import type { LoginRequest } from "@bustrack/types/models/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const useLogin = () => {
    const router = useRouter();

    return useMutation({
      mutationFn: (body: LoginRequest) => loginUser(body),
      onSuccess: (res) => {
        const { accessToken, refreshToken, user } = res.data;
        localStorage.setItem("auth_token", accessToken!);
        localStorage.setItem("refresh_token", refreshToken!);
        localStorage.setItem("auth_user", JSON.stringify(user));
        window.dispatchEvent(new StorageEvent("storage"));
        toast.success("Login successful");
        router.replace("/dashboard");
      },
      onError: (err) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Login failed";
        toast.error(message);
      },
    });
  };

  return { useLogin };
};

export default useAuth;
