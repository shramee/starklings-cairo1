import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../constants/api";
import { ICompletedExercise, IExercise } from "../types/exercise";
import { getUser } from "../utils/getUser";
import { getName } from "../utils/getName";

export const useGetExercises = (user = getUser()) => {
  return useQuery<IExercise[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      const { data: exercises } = await axios.get(API_URL + "/exercises");
      const { data: completedExercises } = await axios.get(
        `${API_URL}/user/${user}/exercise`
      );
      return exercises.map((exercise: IExercise) => {
        return {
          ...exercise,
          id: exercise.name,
          name: getName(exercise.name),
          completed: !!completedExercises.find(
            (completedExercise: ICompletedExercise) =>
              completedExercise.exercise_id === exercise.id
          ),
        };
      });
    },
  });
};
