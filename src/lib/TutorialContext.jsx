import React, { createContext, useState, useContext, useEffect } from 'react';

const TutorialContext = createContext();

export function TutorialProvider({ children }) {
  const [isTutorialEnabled, setIsTutorialEnabled] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  // Verificar se o usuário já viu o tutorial
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenTutorial');
    setHasSeenTutorial(!!seen);
  }, []);

  const startTutorial = () => {
    setIsTutorialEnabled(true);
  };

  const endTutorial = () => {
    setIsTutorialEnabled(false);
    localStorage.setItem('hasSeenTutorial', 'true');
    setHasSeenTutorial(true);
  };

  const resetTutorial = () => {
    localStorage.removeItem('hasSeenTutorial');
    setHasSeenTutorial(false);
  };

  return (
    <TutorialContext.Provider 
      value={{ 
        isTutorialEnabled, 
        hasSeenTutorial, 
        startTutorial, 
        endTutorial,
        resetTutorial
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial deve ser usado dentro de um TutorialProvider');
  }
  return context;
}