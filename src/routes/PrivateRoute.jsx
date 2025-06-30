import { EcoPlayDashboard } from "@/features/Dashboard/EcoPlayDashboard";
import { ScenarioPage } from "@/features/Scénario/ScenarioPage";
import { getUserProgress } from "@/lib/api/scenario";
import { getScenario } from "@/lib/api/scenario";
import { getSteps } from "@/lib/api/steps";
import { getChoices } from "@/lib/api/choices";
import { getCurrentUser } from "@/lib/api/user";
const user = await getCurrentUser();

export const privateRoutes = [
  {
    path: "/dashboard",
    element: <EcoPlayDashboard user={user} />,
  },
  {
    path: "/scenario/:scenarioId",
    element: <ScenarioPage />,
  },
];
