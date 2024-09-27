import React from 'react';
import { FaPrint } from 'react-icons/fa';
import { config } from '../../assets/config'; // Para obter as informações do órgão

const ExportDetailToPDF = ({ contentRef }) => {

  // Função para imprimir o conteúdo da página
  const printPage = () => {
    const content = contentRef.current;

    if (content) {
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write('<html><head><title>Imprimir</title>');

      // Estilos personalizados para a impressão
      printWindow.document.write(`
        <style>
          body { font-family: Arial, sans-serif; font-size: 10px; margin: 20px; }
          .detalhes { display: flex; flex-wrap: wrap; justify-content: space-between; }
          .detalhes span { width: 48%; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table, th, td { border: 1px solid black; }
          th, td { padding: 8px; text-align: left; white-space: nowrap; }
          th { background-color: #f2f2f2; }
          @media print {
            @page { size: landscape; } /* Força a impressão em paisagem */
          }
        </style>
      `);

      printWindow.document.write('</head><body>');
      printWindow.document.write(content.innerHTML); // Adiciona o conteúdo para impressão
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="export-buttons">
      <button onClick={printPage} title="Imprimir">
        <FaPrint /> Imprimir
      </button>
    </div>
  );
};

export default ExportDetailToPDF;
