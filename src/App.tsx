import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import SimpleDashboard from './components/SimpleDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        {isAuthenticated ? (
          <SimpleDashboard onLogout={handleLogout} />
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;