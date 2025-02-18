import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/api";
import { getUser } from "../utils/getUser";

export const useMarkExerciseDone = () => {
  const queryClient = useQueryClient();
  const user = getUser();
  return useMutation({
    mutationFn: (exercise: string) => {
      return axios.post(
        `${API_URL}/user/${user}/exercise/${exercise}/done`,
        {}
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
};
