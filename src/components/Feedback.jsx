import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import './Feedback.css';

export default function Feedback({ conversationId, messageIndex, userId }) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFeedback = async (val) => {
    setValue(val);
    setLoading(true);
    const { error } = await supabase.from('feedback').insert({
      conversation_id: conversationId,
      message_index: messageIndex,
      user_id: userId,
      value: val,
      created_at: new Date()
    });
    setLoading(false);
    if (error) {
      toast.error('Erro ao enviar feedback');
    } else {
      toast.success('Obrigado pelo feedback!');
    }
  };

  return (
    <div className="feedback-component feedback-button">
      <span>Feedback:</span>
      <button
        className={`feedback-btn ${value === 1 ? 'selected' : ''}`}
        onClick={() => handleFeedback(1)}
        disabled={loading}
        aria-label="Gostei"
      >👍</button>
      <button
        className={`feedback-btn ${value === -1 ? 'selected' : ''}`}
        onClick={() => handleFeedback(-1)}
        disabled={loading}
        aria-label="Não gostei"
      >👎</button>
    </div>
  );
}
