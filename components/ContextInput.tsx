
import React, { useState } from 'react';

interface ContextInputProps {
  onSubmit: (context: string) => void;
  isLoading: boolean;
}

const ContextInput: React.FC<ContextInputProps> = ({ onSubmit, isLoading }) => {
  const [context, setContext] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (context.trim()) {
      onSubmit(context.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 text-center">
      <label htmlFor="context" className="block text-lg font-medium text-dark-text">
        Para que tipo de documento é esta imagem?
      </label>
      <p className="text-sm text-dark-subtext">ex: "apresentação de vendas", "relatório anual", "cabeçalho de post de blog"</p>
      <input
        id="context"
        type="text"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Digite o contexto do documento..."
        className="w-full px-4 py-3 bg-dark-card border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !context.trim()}
        className="w-full px-6 py-3 text-base font-semibold text-white bg-brand-primary rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:bg-gray-500 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Gerando...' : 'Gerar 8 Versões'}
      </button>
    </form>
  );
};

export default ContextInput;