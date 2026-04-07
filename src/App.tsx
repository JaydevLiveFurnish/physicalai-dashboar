import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/pages/HomePage";
import { PropsPage } from "@/pages/PropsPage";
import { MaterialsPage } from "@/pages/MaterialsPage";
import { EnvironmentLibraryPage } from "@/pages/EnvironmentLibraryPage";
import { KitchenConfiguratorPage } from "@/pages/KitchenConfiguratorPage";
import { BatchGenerationPage } from "@/pages/BatchGenerationPage";
import { ApiDocsPage } from "@/pages/ApiDocsPage";
import { SimReadyPage } from "@/pages/SimReadyPage";
import { AccountPage } from "@/pages/AccountPage";
import { RequestCustomPage } from "@/pages/RequestCustomPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assets/props" element={<PropsPage />} />
        <Route path="/assets/materials" element={<MaterialsPage />} />
        <Route path="/environments" element={<EnvironmentLibraryPage />} />
        <Route path="/environments/kitchen/configure" element={<KitchenConfiguratorPage />} />
        <Route path="/environments/request-custom" element={<RequestCustomPage />} />
        <Route path="/batch" element={<BatchGenerationPage />} />
        <Route path="/api" element={<ApiDocsPage />} />
        <Route path="/simready" element={<SimReadyPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
