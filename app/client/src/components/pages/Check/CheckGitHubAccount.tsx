import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { List, ListItem, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import { useGetExercises } from "../../../queries/useGetExercises";
import { CircularProgressCenterLoader } from "../../shared/CircularProgressCenterLoader";

export const CheckGitHubAccount = () => {
  const { account } = useParams();
  const { data: exercises, isLoading } = useGetExercises(account);
  const completedExercises =
    exercises?.filter((exercise) => exercise.completed)?.length ?? 0;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 6,
        flexDirection: "column",
      }}
    >
      <Typography variant="h5">
        Results for GitHub account: {account}
      </Typography>{" "}
      {!isLoading && (
        <Typography>
          {completedExercises}/{exercises?.length ?? 54} exercises completed
        </Typography>
      )}
      <br />
      <Box sx={{ maxHeight: "calc(100vh - 300px)", overflowY: "scroll" }}>
        {isLoading ? (
          <CircularProgressCenterLoader />
        ) : (
          <List>
            {exercises?.map((exercise) => (
              <ListItem
                sx={{
                  my: 0,
                  py: 0.5,
                }}
                key={exercise.id}
              >
                <Typography
                  sx={{
                    color: exercise.completed ? "#34b830" : "#999",
                  }}
                >
                  {exercise.name}
                </Typography>
                {exercise.completed && (
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 18, color: "#34b830", ml: 2 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};
