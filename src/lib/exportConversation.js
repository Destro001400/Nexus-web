import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

// Função para exportar conversa em PDF com renderização avançada de tabelas
export function exportAsPdf(messages, filename = 'conversa-pro.pdf') {
  const doc = new jsPDF();
  let yPosition = 15; // Posição inicial no eixo Y

  const addText = (text, options = {}) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const splitText = doc.splitTextToSize(text, 180); // 180 é a largura do texto
    
    const textHeight = splitText.length * 5; // Approximate height
    if (yPosition + textHeight > pageHeight - 20) { // Check for page overflow
      doc.addPage();
      yPosition = 15;
    }
    
    doc.text(splitText, 15, yPosition, options);
    yPosition += textHeight + 2; // Add space after the text
  };

  messages.forEach(message => {
    if (yPosition > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 15;
    }

    // Adiciona o remetente em negrito
    doc.setFont('helvetica', 'bold');
    addText(`${message.role}:`);
    doc.setFont('helvetica', 'normal');

    const content = message.content;

    // Detecta e renderiza tabelas
    if (content.includes('| ---')) {
      try {
        const lines = content.split('\n').filter(line => line.trim().startsWith('|') && line.trim().length > 1);
        if (lines.length < 2) { // Not a valid table (header + separator at least)
            addText(content);
            return;
        }
        
        const head = [lines[0].split('|').map(h => h.trim()).slice(1, -1)];
        const body = lines.slice(2).map(row => row.split('|').map(cell => cell.trim()).slice(1, -1));

        autoTable(doc, {
            startY: yPosition,
            head: head,
            body: body,
            theme: 'striped',
            styles: {
            fontSize: 8,
            cellPadding: 2,
            },
            headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
            }
        });
        yPosition = doc.lastAutoTable.finalY + 10;
      } catch (e) {
        console.error("Error parsing table:", e);
        addText(content); // Fallback to plain text if table parsing fails
      }
    } else {
      // Renderiza texto normal
      addText(content);
    }

    yPosition += 3; // Espaço entre as mensagens
  });

  doc.save(filename);
};


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
