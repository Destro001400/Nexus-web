import { MessageSquare, Code, Music, Beaker, BrainCircuit } from 'lucide-react';

// Este componente recebe a categoria como uma string e retorna o ícone correspondente.
export default function CategoryIcon({ category, ...props }) {
  switch (category) {
    case 'code':
      return <Code {...props} />;
    case 'music':
      return <Music {...props} />;
    case 'research':
      return <Beaker {...props} />;
    case 'creative':
        return <BrainCircuit {...props} />;
    case 'general':
    default:
      return <MessageSquare {...props} />;
  }
}