import { Navigate, Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/defaultPages/IndexPage";
import LoginPage from "./pages/defaultPages/LoginPage";
import ProfilePage from "./pages/defaultPages/ProfilePage";
import NotFoundPage from "./pages/defaultPages/NotFoundPage";
import { AuthData } from "./providers/AuthProvider";
import { routesConfig } from "./config/routes";
import DefaultLayout from "./layouts/DefaultLayout";
import LoadingLayout from "./layouts/LoadingLayout";
import LayoutProvider from "./providers/LayoutProvider";
import ForgotPasswordForm from "./pages/defaultPages/ForgotPassword";
import ForgotPasswordOk from "./pages/defaultPages/ForgotPasswordOk";
import ResetPasswordPage from "./pages/defaultPages/ResetPasswordPage";
import SettingsPage from "./pages/defaultPages/SettingsPage/SettingsPage";

function App() {
  const { appLoading, isAuthenticated, modules } = AuthData();

  if (appLoading) return <LoadingLayout />;

  if (!isAuthenticated)
    return (
      <Routes>
        <Route element={<Navigate to="/login" />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<ForgotPasswordForm/>} path="/forgot-password" />
        <Route element={<ForgotPasswordOk/>} path="/forgot-password/ok" />
        <Route element={<ResetPasswordPage/>} path="/reset-password" />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    );

  return (
    <LayoutProvider>
      <DefaultLayout>
        <Routes>
          <Route element={<IndexPage />} path="/" />
          <Route element={<ProfilePage />} path="/profile" />
          <Route element={<SettingsPage/>} path="/settings" />
          {modules &&
            modules.map((module) =>
              module.rutas.map((ruta, index) => {
                const URI = `${module.nombre.toLowerCase()}/${ruta.ruta.toLowerCase()}`;
                return (
                  <Route key={index} element={routesConfig[URI]} path={URI} />
                );
              })
            )}
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
      </DefaultLayout>
    </LayoutProvider>
  );
}

export default App;
