import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/api";
import { getUser } from "../utils/getUser";

const headers = {
  "Content-Type": "text/plain",
};

interface ICompileCairoProps {
  exercise: string;
  code: string;
}

export const useCompileCairo = () => {
  const queryClient = useQueryClient();
  const user = getUser();
  return useMutation({
    mutationFn: ({ exercise, code }: ICompileCairoProps) => {
      return axios.post(`${API_URL}/user/${user}/exercise/${exercise}`, code, {
        headers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
};
