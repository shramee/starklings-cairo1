import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/api";

export interface IUserDataResponse {
  data: IUserData
}

interface IUserData {
  login: string,
  avatar_url: string
}

export const useGetUserData = (onSuccess: (data: any) => void) => {
  return useMutation({
    mutationFn: (accessToken: string) => {
      return axios.get(`${API_URL}/github/user-data`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
    },
    onSuccess,
  });
};
