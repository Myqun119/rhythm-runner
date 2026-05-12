import { createBrowserRouter } from "react-router";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainMenu from "./pages/MainMenu";
import GameMode from "./pages/GameMode";
import MusicSelect from "./pages/MusicSelect";
import Leaderboard from "./pages/Leaderboard";
import MapWorkshop from "./pages/MapWorkshop";
import MapDetail from "./pages/MapDetail";
import MapEditor from "./pages/MapEditor";
import CreateMapChoice from "./pages/CreateMapChoice";
import GameOver from "./pages/GameOver";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/menu",
    Component: MainMenu,
  },
  {
    path: "/game-mode",
    Component: GameMode,
  },
  {
    path: "/music-select",
    Component: MusicSelect,
  },
  {
    path: "/leaderboard",
    Component: Leaderboard,
  },
  {
    path: "/workshop",
    Component: MapWorkshop,
  },
  {
    path: "/map/:id",
    Component: MapDetail,
  },
  {
    path: "/editor",
    Component: MapEditor,
  },
  {
    path: "/profile/new-map",
    Component: CreateMapChoice,
  },
  {
    path: "/game-over",
    Component: GameOver,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/profile",
    Component: Profile,
  },
]);
