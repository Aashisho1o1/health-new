import { createBrowserRouter } from "react-router";
import { AppShell } from "./components/AppShell";
import { Landing } from "./pages/Landing";
import { Cases } from "./pages/Cases";
import { Interview } from "./pages/Interview";
import { Progress } from "./pages/Progress";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppShell,
    children: [
      { index: true, Component: Landing },
      { path: "cases", Component: Cases },
      { path: "interview/:caseId", Component: Interview },
      { path: "progress", Component: Progress },
    ],
  },
]);
