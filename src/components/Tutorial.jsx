import React from 'react';
import Joyride from 'react-joyride';
import { useTutorial } from '../lib/TutorialContext';
import './Tutorial.css';

const TOUR_STEPS = [
  {
    target: '.welcome-screen',
    content: 'Bem-vindo ao Nexus! Este é um assistente inteligente que vai te ajudar em várias tarefas.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.sidebar',
    content: 'Aqui você encontra suas conversas recentes e pode iniciar novas conversas.',
    placement: 'right',
  },
  {
    target: '.chat-input',
    content: 'Digite suas mensagens aqui. Use "/" para acessar comandos especiais.',
    placement: 'top',
  },
  {
    target: '.chat-header',
    content: 'Acesse configurações da conversa, exporte ou compartilhe seus chats.',
    placement: 'bottom',
  },
  {
    target: '.personas-section',
    content: 'Escolha diferentes personas especializadas para tarefas específicas.',
    placement: 'right',
  },
  {
    target: '.feedback-button',
    content: 'Nos ajude a melhorar! Dê sua opinião sobre as respostas.',
    placement: 'left',
  },
  {
    target: '.theme-toggle',
    content: 'Alterne entre tema claro e escuro conforme sua preferência.',
    placement: 'bottom',
  },
  {
    target: '.user-profile',
    content: 'Acesse seu perfil, histórico de atividades e configurações.',
    placement: 'right',
  }
];

export default function Tutorial() {
  const { isTutorialEnabled, endTutorial } = useTutorial();

  return (
    <Joyride
      steps={TOUR_STEPS}
      run={isTutorialEnabled}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'var(--primary)',
          textColor: 'var(--text)',
          backgroundColor: 'var(--surface)',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          spotlightPadding: 0,
        },
        buttonNext: {
          backgroundColor: 'var(--primary)',
          color: 'white',
        },
        buttonBack: {
          color: 'var(--text)',
        },
        buttonSkip: {
          color: 'var(--text)',
        },
        spotlight: {
          borderRadius: 8,
        }
      }}
      floaterProps={{
        disableAnimation: true,
        offset: 15
      }}
      tooltipComponent={({ continuous, index, size, step, backProps, closeProps, primaryProps, skipProps }) => (
        <div className="tutorial-tooltip">
          <h4>{step.title}</h4>
          <div>{step.content}</div>
          <div className="tutorial-buttons">
            {index > 0 && <button {...backProps}>Voltar</button>}
            {continuous ? (
              <button {...primaryProps}>{index === size - 1 ? 'Concluir' : 'Próximo'}</button>
            ) : (
              <button {...closeProps}>Ok</button>
            )}
            {index < size - 1 && <button {...skipProps}>Pular</button>}
          </div>
        </div>
      )}
      callback={({ status }) => {
        if (['finished', 'skipped'].includes(status)) {
          endTutorial();
        }
      }}
    />
  );
}