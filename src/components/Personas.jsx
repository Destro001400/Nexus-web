import './Personas.css';
import { personas } from '../lib/personas.jsx';

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