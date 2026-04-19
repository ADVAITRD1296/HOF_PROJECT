import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardLayout } from './pages/DashboardLayout';
import { AssistantPage } from './pages/AssistantPage';
import { CasesPage } from './pages/CasesPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { LawyersPage } from './pages/LawyersPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LawyerSignUpPage } from './pages/LawyerSignUpPage';
import { AuthoritiesPage } from './pages/AuthoritiesPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/lawyer-sign-up" element={<LawyerSignUpPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/ask" replace />} />
            <Route path="ask" element={<AssistantPage />} />
            <Route path="cases" element={<CasesPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="authorities" element={<AuthoritiesPage />} />
            <Route path="lawyers" element={<LawyersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
