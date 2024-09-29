import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportDetailToPDF = ({ contentRef }) => {
  const handleDownloadPDF = async () => {
    const content = contentRef.current; // Acessa o conteúdo da página

    // Usa o html2canvas para capturar o conteúdo como imagem
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true, // Certifique-se de capturar conteúdo corretamente com CORS
    });

    const imageData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape', // Modo paisagem
      unit: 'px',
      format: 'a4', // Formato A4
    });

    const margin = 20; // Define a margem do PDF
    const pageWidth = pdf.internal.pageSize.getWidth(); // Largura da página
    const pageHeight = pdf.internal.pageSize.getHeight(); // Altura da página
    const imageWidth = pageWidth - 2 * margin; // Largura da imagem com margem
    const imageHeight = (canvas.height * imageWidth) / canvas.width; // Proporção da imagem

    // Adiciona a imagem (conteúdo capturado) ao PDF com margem
    pdf.addImage(imageData, 'PNG', margin, margin, imageWidth, imageHeight);

    // Abre o PDF em uma nova janela/aba
    const pdfBlob = pdf.output('blob'); // Gera o Blob do PDF
    const pdfURL = URL.createObjectURL(pdfBlob); // Cria uma URL a partir do Blob
    window.open(pdfURL); // Abre a URL gerada em uma nova aba
  };

  return (
    <button onClick={handleDownloadPDF}>
      Abrir PDF
    </button>
  );
};

export default ExportDetailToPDF;
