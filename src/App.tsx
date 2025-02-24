import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import Home from "./pages/Home";
import TemplatesPage from "./pages/Templates";
import CreateTemplate from "./pages/CreateTemplates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditTemplates from "./pages/FillTemplates";
import UserFilledTemplates from "./pages/filledUserTemplates";
import Statistics from "./pages/Stats";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1a1b5e",
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/templatesPage" element={<TemplatesPage />} />
            <Route path="/createTemplates" element={<CreateTemplate />} />
            <Route path="/editTemplates/:id" element={<EditTemplates />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route
              path="/filledUserTemplates/:id"
              element={<UserFilledTemplates />}
            />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
