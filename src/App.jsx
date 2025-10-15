
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { TutorialProvider } from './lib/TutorialContext';
import ErrorBoundary from './components/ErrorBoundary';
import Tutorial from './components/Tutorial';
import AppRoutes from './routes/AppRoutes'; // Import the new routes component
import './App.css';

function App() {
  // The session logic is now handled within AppRoutes and ProtectedRoute
  // The main App component is now cleaner and focused on providers

  return (
    <ErrorBoundary>
      <TutorialProvider>
        <BrowserRouter>
          <Toaster />
          <Tutorial />
          <AppRoutes />
        </BrowserRouter>
      </TutorialProvider>
    </ErrorBoundary>
  );
}

export default App;
