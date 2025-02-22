import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/api";

export interface ITokenResponse {
  data: ITokenData
}

export interface ITokenData {
  access_token: string;
  scope: string;
  token_type: string;
}

export const useGetAccessToken = (onSuccess: (data: any) => void) => {
  return useMutation({
    mutationFn: (code: string) => {
      return axios.get(`${API_URL}/github/access-token?code=${code}`);
    },
    onSuccess,
  });
};
