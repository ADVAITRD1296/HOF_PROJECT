import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LexisCoHomepage } from './components/LexisCoHomepage';
import { LexisCoAdvancedAIMentorInterface } from './components/LexisCoAdvancedAIMentorInterface';
import { LexisCoProfile } from './components/LexisCoProfile';
import { LexisCoSignIn } from './components/LexisCoSignIn';
import { LexisCoCreateAccount } from './components/LexisCoCreateAccount';
import { LexisCoSubscription } from './components/LexisCoSubscription';
import { LexisCoFeedbackForm } from './components/LexisCoFeedbackForm';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LexisCoHomepage />} />
        <Route path="/mentor" element={<LexisCoAdvancedAIMentorInterface />} />
        <Route path="/dashboard" element={<LexisCoProfile />} />
        <Route path="/login" element={<LexisCoSignIn />} />
        <Route path="/register" element={<LexisCoCreateAccount />} />
        <Route path="/subscription" element={<LexisCoSubscription />} />
        <Route path="/feedback" element={<LexisCoFeedbackForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
