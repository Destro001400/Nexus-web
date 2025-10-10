import { Code, Music, BrainCircuit, Bot, Globe } from 'lucide-react';
import './Personas.css';

export const personas = {
  general: {
    name: 'Geral',
    icon: <Bot size={20} />,
    prompt: 'Você é o Nexus, um assistente de IA geral, prestativo e criativo, projetado para ajudar os utilizadores com uma ampla gama de tarefas.',
  },
  coder: {
    name: 'Programador',
    icon: <Code size={20} />,
    prompt: 'Aja como um programador sénior especialista. Forneça explicações claras, exemplos de código eficientes e as melhores práticas de programação. Seja direto e técnico.',
  },
  musician: {
    name: 'Letrista',
    icon: <Music size={20} />,
    prompt: 'Aja como um compositor e letrista experiente. Foque em criatividade, ritmo, rima e emoção. Use uma linguagem poética e inspiradora para ajudar a criar músicas.',
  },
  creative: {
    name: 'Criativo',
    icon: <BrainCircuit size={20} />,
    prompt: 'Aja como um especialista em brainstorming e criatividade. Gere ideias inovadoras, pense fora da caixa e ajude a expandir conceitos. Seja imaginativo e encoraje a exploração de novas possibilidades.',
  },
  webSearch: {
    name: 'Pesquisador',
    icon: <Globe size={20} />, // Precisaremos importar o ícone 'Globe'
    prompt: 'Você é um assistente de pesquisa. Sua função é responder perguntas usando informações em tempo real da internet que serão fornecidas a você.',
  },
};

export default function Personas({ activePersona, onSelectPersona }) {
  return (
    <div className="personas-container personas-section">
      <p className="personas-label">Persona:</p>
      <div className="personas-buttons">
        {Object.keys(personas).map((key) => (
          <button
            key={key}
            className={`persona-button ${activePersona === key ? 'active' : ''}`}
            onClick={() => onSelectPersona(key)}
            title={personas[key].name}
          >
            {personas[key].icon}
            {/* Apenas o nome da persona, sem o "Geral" */}
            <span>{personas[key].name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}