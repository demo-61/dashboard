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
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          {isAuthenticated ? (
            <SimpleDashboard onLogout={handleLogout} />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;