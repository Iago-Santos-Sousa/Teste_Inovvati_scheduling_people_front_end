import api from "./api";

import { AxiosError, AxiosResponse } from "axios";

type UserInfo = {
  name: string;
  email: string;
  password: string;
};

export const usersApi = () => ({
  createUser: async (userInfo: UserInfo): Promise<AxiosResponse> => {
    const { name, email, password } = userInfo;
    const response: AxiosResponse = await api.post("/users/signup", {
      name,
      email,
      password,
    });

    return response.data;
  },
});
