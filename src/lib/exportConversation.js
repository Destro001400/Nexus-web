import jsPDF from 'jspdf';
import { marked } from 'marked';

// Função para exportar conversa em TXT
export function exportAsTxt(messages, filename = 'conversa.txt') {
  const content = messages.map(m => `[${m.role}] ${m.content}`).join('\n\n');
  downloadFile(content, filename, 'text/plain');
}

// Função para exportar conversa em Markdown
export function exportAsMarkdown(messages, filename = 'conversa.md') {
  const content = messages.map(m => `**${m.role}:**\n${m.content}`).join('\n\n');
  downloadFile(content, filename, 'text/markdown');
}

// Função para exportar conversa em PDF, renderizando Markdown
export function exportAsPdf(messages, filename = 'conversa.pdf') {
  const pdf = new jsPDF('p', 'mm', 'a4');

  // Create a container for the entire conversation
  const conversationContainer = document.createElement('div');
  conversationContainer.style.width = '180mm'; // A4 width - margins
  conversationContainer.style.padding = '10mm';
  conversationContainer.style.fontFamily = 'Helvetica, sans-serif';
  conversationContainer.style.fontSize = '10pt';
  conversationContainer.style.lineHeight = '1.5';
  conversationContainer.style.wordWrap = 'break-word';
  conversationContainer.style.color = 'black'; // Garante que o texto seja preto no PDF

  // Generate HTML for all messages
  const htmlContent = messages.map(m => {
    const role = `<strong>${m.role}:</strong>`;
    // Convert markdown to HTML
    const content = marked(m.content);
    return `<div style="margin-bottom: 10px;">${role}<br>${content}</div>`;
  }).join('<hr style="margin: 15px 0;">');

  conversationContainer.innerHTML = htmlContent;
  document.body.appendChild(conversationContainer); // Add to DOM to be rendered

  pdf.html(conversationContainer, {
    callback: function (doc) {
      doc.save(filename);
      document.body.removeChild(conversationContainer); // Clean up
    },
    x: 10,
    y: 10,
    width: 190, // Usable width on A4
    windowWidth: conversationContainer.scrollWidth
  });
}


function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}