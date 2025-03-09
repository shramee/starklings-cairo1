import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useGetExercises } from "../../../queries/useGetExercises";
import { CircularProgressCenterLoader } from "../../shared/CircularProgressCenterLoader";

const DESIRED_LENGTH = 25;

interface IExerciseListProps {
  currentExercise: string;
  open: boolean;
}

const sliceArrayToMiddle = (
  array: any[],
  currentPosition: number,
  showPrevious = false,
  showNext = false
) => {
  const arrayLength = array.length;

  // If the array length is already less than or equal to the desired length, return the original array
  if (arrayLength <= DESIRED_LENGTH || (showPrevious && showNext)) {
    return array;
  }

  // Calculate the starting index for the sliced array
  let startIndex = Math.max(
    currentPosition - Math.floor(DESIRED_LENGTH / 2),
    0
  );

  // Calculate the ending index for the sliced array
  let endIndex = Math.min(startIndex + DESIRED_LENGTH, arrayLength);

  // Adjust the starting index if necessary to ensure the sliced array has the desired length
  startIndex = Math.max(endIndex - DESIRED_LENGTH, 0);

  if (showPrevious) {
    startIndex = 0;
  }

  if (showNext) {
    endIndex = arrayLength;
  }

  // Return the sliced array
  return array.slice(startIndex, endIndex);
};

export const ExerciseList = ({ currentExercise, open }: IExerciseListProps) => {
  const { data: exercises, isLoading } = useGetExercises();
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNext, setShowNext] = useState(false);
  
  if (isLoading) {
    return <CircularProgressCenterLoader />;
  }
  
  const lastCompleted =
  exercises
  ?.filter((exercise) => {
    return !!exercise.completed;
  })
  ?.slice(-1)[0]?.exercise_order ?? 0;
  
  const currentExerciseOrder =
  exercises?.find((exercise) => exercise.id === currentExercise)
  ?.exercise_order ?? 0;

  const shownExercises =
    exercises && currentExerciseOrder
      ? sliceArrayToMiddle(
          exercises,
          currentExerciseOrder,
          showPrevious,
          showNext
        )
      : [];

  return (
    <List>
      {shownExercises?.[0]?.exercise_order !== 1 && (
        <LoadMoreButton
          description="Load previous exercises"
          open={open}
          onClick={() => setShowPrevious(true)}
        />
      )}
      {shownExercises?.map((exercise) => (
        <ListItem key={exercise.id} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            href={`/exercise/${exercise.id}`}
            selected={exercise.id === currentExercise}
            disabled={
              exercise.exercise_order - 1 > lastCompleted &&
              exercise.exercise_order > currentExerciseOrder
            }
            sx={{
              height: 30,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            {!open && (
              <ListItemIcon
                id={exercise.id}
                sx={{
                  minWidth: 0,
                  mr: "auto",
                  justifyContent: "center",

                  color: exercise.completed ? "#34b830" : "white",
                }}
              >
                {exercise.name.charAt(0) +
                  exercise.name.charAt(exercise.name.length - 1)}
              </ListItemIcon>
            )}
            <ListItemText
              id={exercise.id}
              primary={exercise.name}
              sx={{
                opacity: open ? 1 : 0,
                color: exercise.completed ? "#34b830" : "white",
              }}
            />
            {exercise.completed && open && (
              <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#34b830" }} />
            )}
          </ListItemButton>
        </ListItem>
      ))}
      {shownExercises?.slice(-1)[0]?.id !== exercises?.slice(-1)[0]?.id && (
        <LoadMoreButton
          description="Load next exercises"
          open={open}
          onClick={() => setShowNext(true)}
        />
      )}
    </List>
  );
};

interface ILoadMoreButtonProps {
  description: string;
  open: boolean;
  onClick: () => void;
}

const LoadMoreButton = ({
  description,
  open,
  onClick,
}: ILoadMoreButtonProps) => {
  const button = (
    <ListItemButton sx={{ color: "#777" }} onClick={onClick}>
      {open ? description : <MoreHorizIcon />}
    </ListItemButton>
  );
  return !open ? <Tooltip title={description}>{button}</Tooltip> : button;
};
