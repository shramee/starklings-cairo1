import { IExercise } from "../types/exercise";

export const findNextExercise = (
  exercises: IExercise[],
  currentExerciseId: string
) => {
  const currentExerciseIndex = exercises.findIndex(
    (exercise) => exercise.id === currentExerciseId
  );

  if (currentExerciseIndex === undefined) {
    return "intro1";
  }
  for (let i = currentExerciseIndex + 1; i < exercises.length; i++) {
    if (!exercises[i]?.completed) {
      return exercises[i]?.id;
    }
  }
  for (let i = 0; i < currentExerciseIndex; i++) {
    if (!exercises[i]?.completed) {
      return exercises[i]?.id;
    }
  }
  return null;
};

export const findPrevExercise = (
  exercises: IExercise[],
  currentExerciseId: string
) => {
  const currentExerciseIndex = exercises.findIndex(
    (exercise) => exercise.id === currentExerciseId
  );

  if (currentExerciseIndex === undefined) {
    return "intro1";
  }

  if (currentExerciseIndex === 0) {
    return null;
  }

  return exercises[currentExerciseIndex - 1]?.id;
};
