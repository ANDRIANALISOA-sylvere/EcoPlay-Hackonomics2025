import { Route, Routes, Navigate } from "react-router-dom";
import { publicRoutes, privateRoutes } from "@/routes";
import { useAuth } from "@/hooks/useAuth";
import { Nav } from "@/features/homepage/components/Nav";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        {/* Routes publiques */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* Routes privées */}
        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              isAuthenticated ? (
                route.element
              ) : (
                <Navigate to="/" state={{ from: route.path }} replace />
              )
            }
          />
        ))}

        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;