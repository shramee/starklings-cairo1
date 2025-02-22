import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/api";

export const useGetHint = (exerciseName: string, onSuccess: (data: any) => void) => {
  return useMutation({
    mutationFn: () => {
      return axios.get(`${API_URL}/exercises/${exerciseName}/hint`);
    },
    onSuccess
  });
};
