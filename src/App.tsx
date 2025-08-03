import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SimpleDashboard from './components/SimpleDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PDFUploader from './components/Uploader';
import { CoverLetterPreview } from './components/CoverLetterPreview';
// import CoverLetterPreview from './components/CoverLetterPreview';

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
        <Router>
          <Routes>
            <Route path="/" element={
              isAuthenticated ? (
                <SimpleDashboard onLogout={handleLogout} />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } />
            <Route 
              path="/cv-enhancement" 
              element={
                isAuthenticated ? (
                  <PDFUploader title="CV Enhancement" />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/cover-letter" 
              element={
                isAuthenticated ? (
                  <PDFUploader title="Cover Letter" />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/cover-letter-preview" 
              element={
                isAuthenticated ? (
                  <CoverLetterPreview />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/linkedin-optimization" 
              element={
                isAuthenticated ? (
                  <PDFUploader title="LinkedIn Optimization" />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;