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

// Função para exportar conversa em PDF (simples, usando window.print)
export function exportAsPdf(messages) {
  const win = window.open('', '_blank');
  win.document.write('<html><head><title>Conversa</title></head><body>');
  win.document.write(messages.map(m => `<b>${m.role}:</b><br>${m.content.replace(/\n/g, '<br>')}<hr>`).join(''));
  win.document.write('</body></html>');
  win.document.close();
  win.print();
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
