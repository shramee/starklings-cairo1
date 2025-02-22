import { List, ListItem, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useGetGraduates } from "../../../queries/useGetGraduates";
import { IGraduate } from "../../../types/graduate";
import { CircularProgressCenterLoader } from "../../shared/CircularProgressCenterLoader";

export const CheckGraduates = () => {
  const { data: graduates, isLoading } = useGetGraduates();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 6,
        flexDirection: "column",
      }}
    >
      <Typography variant="h5">Starklings graduates:</Typography> <br />
      <Box sx={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
        {isLoading ? (
          <CircularProgressCenterLoader />
        ) : (
          <List>
            {graduates?.map((graduate: IGraduate) => (
              <ListItem
                sx={{
                  my: 0,
                  py: 0.5,
                }}
                key={graduate.user_name}
              >
                <Typography>{graduate.user_name}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <br />
      {!isLoading && <Typography>Total: {graduates?.length}</Typography>}
    </Box>
  );
};
