import { CURRENT_EXERCISE } from "../constants/localStorage";

const DEFAULT_FIRST_EXERCISE_ID = "intro1";

export const getFirstExerciseUrl = () => {
  const localStorageExerciseId = localStorage.getItem(CURRENT_EXERCISE);
  return `/exercise/${localStorageExerciseId ?? DEFAULT_FIRST_EXERCISE_ID}`;
};
