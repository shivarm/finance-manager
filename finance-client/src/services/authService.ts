import api from "@/services/api";
import type { AuthResponse, SignupRequest, LoginRequest, ExportData, Avatar } from "@/types/auth.types";
import type { ApiResponse, User } from "@/types/index.types";

export const signupService = async (data: SignupRequest) => {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);

  return response.data;
};

export const loginService = async (data: LoginRequest) => {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);

  return response.data;
};

export const getProfileService = async () => {
  const response = await api.get<ApiResponse<User>>("/profile");

  return response.data;
};

export const updateProfileService = async (data: {
  name?: string;
  email?: string;
  password?: string;
}) => {
  const response = await api.put<ApiResponse<User>>("/profile", data);

  return response.data;
};

export const uploadAvatarService = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.post<ApiResponse<Avatar>>(
    "/profile/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const deleteAvatarService = async () => {
  const response = await api.delete<ApiResponse<null>>("/profile/avatar");

  return response.data;
};

export const exportDataService = async () => {
  const response = await api.get<ApiResponse<ExportData>>("/profile/export");

  return response.data;
};

export const deleteAccountService = async () => {
  const response = await api.delete<ApiResponse<null>>("/profile/account");

  return response.data;
};
