import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  CSSObject,
  Divider,
  IconButton,
  Theme,
  styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useState } from "react";
import { SIDEBAR_OPEN } from "../../../constants/localStorage";
import { ExerciseList } from "./ExerciseList";

const DRAWER_WIDTH = 250;

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  transform: "translateY(0px)",
  scrollbarColor: "#363636 #121212",
  scrollbarWidth: "thin",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface ISidebarProps {
  currentExercise: string;
}

export const Sidebar = ({ currentExercise }: ISidebarProps) => {
  const lsOpen = window.localStorage.getItem(SIDEBAR_OPEN);

  const [open, setOpen] = useState<boolean>(
    lsOpen === null ? true : lsOpen === "true"
  );

  const toggleSidebar = () => {
    setOpen((prev) => {
      window.localStorage.setItem(SIDEBAR_OPEN, (!prev).toString());
      return !prev;
    });
  };

  return (
    <Drawer variant="permanent" open={open}>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <IconButton sx={{ mx: 0.5 }} onClick={toggleSidebar}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Divider />
      <ExerciseList currentExercise={currentExercise} open={open} />
    </Drawer>
  );
};
