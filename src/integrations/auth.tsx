import api from "./api";

type UserInfos = {
  email: string;
  password: string;
};

interface UserResponse {
  acessToken: string;
  user: {
    email: string;
    name: string;
    userId: number;
  };
}

export const authApi = () => ({
  login: async ({ email, password }: UserInfos): Promise<UserResponse> => {
    const response = await api.post<UserResponse>("/sign", {
      email,
      password,
    });

    return response.data;
  },
});
