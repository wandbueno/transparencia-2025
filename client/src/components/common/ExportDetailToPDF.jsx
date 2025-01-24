import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { config } from '../../assets/config';
import './ExportDetailToPDF.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons'; // Importando o ícone de impressão

const ExportDetailToPDF = ({ contentRef, tableRef, pageTitle }) => {
  const handleDownloadPDF = async () => {
    try {
      const content = contentRef.current; // Acessa o conteúdo dos detalhes
      const tables = tableRef.current; // Acessa o conteúdo das tabelas (se existir)

      // Gera o canvas para o conteúdo
      const canvasContent = await html2canvas(content, {
        scale: 2,
        useCORS: true,
      });

      // Inicializa canvasTables como null e verifica se tables tem conteúdo
      let canvasTables = null;
      if (tables && tables.innerHTML.trim() !== "") {
        canvasTables = await html2canvas(tables, {
          scale: 2,
          useCORS: true,
        });
      }

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
      });

      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth - 2 * margin;

      const contentImageHeight = (canvasContent.height * imageWidth) / canvasContent.width;
      let tableImageHeight = 0;
      if (canvasTables) {
        tableImageHeight = (canvasTables.height * imageWidth) / canvasTables.width;
      }

      // Função para centralizar o texto
      const centerText = (text, y) => {
        const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const x = (pageWidth - textWidth) / 2;
        pdf.text(text, x, y);
      };

      // Rodapé dinâmico com fonte menor
      const renderFooter = (pageNum) => {
        const currentDate = new Date().toLocaleString();
        const footerText = `Informações geradas pelo portal da transparência em ${currentDate}`;
        pdf.setFontSize(8);
        pdf.text(footerText, margin, pageHeight - 10);
        pdf.text(`Página ${pageNum}`, pageWidth - margin - 40, pageHeight - 10);
      };

      // Cabeçalho com título
      pdf.setFontSize(16);
      centerText(config.geral.nomeOrgao, margin + 15);
      pdf.setFontSize(14);
      centerText(pageTitle, margin + 35);

      // Renderiza o conteúdo dos detalhes
      pdf.addImage(canvasContent.toDataURL('image/png'), 'PNG', margin, margin + 60, imageWidth, contentImageHeight);

      // Renderiza o rodapé na primeira página
      renderFooter(1);

      // Se houver conteúdo nas tabelas, renderiza as tabelas
      if (canvasTables) {
        // Verifica se o conteúdo das tabelas cabe na mesma página
        if (contentImageHeight + tableImageHeight > pageHeight - 60) {
          pdf.addPage();
          renderFooter(2); // Rodapé na segunda página
          pdf.addImage(canvasTables.toDataURL('image/png'), 'PNG', margin, margin + 60, imageWidth, tableImageHeight);
        } else {
          // Se cabe, renderiza as tabelas logo abaixo do conteúdo
          pdf.addImage(canvasTables.toDataURL('image/png'), 'PNG', margin, margin + 60 + contentImageHeight, imageWidth, tableImageHeight);
        }
      }

      // Gera o PDF
      const pdfBlob = pdf.output('blob');
      const pdfURL = URL.createObjectURL(pdfBlob);
      window.open(pdfURL);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <button onClick={handleDownloadPDF} className="print-button">
      <FontAwesomeIcon icon={faPrint} style={{ marginRight: '5px' }} />
      Imprimir
    </button>
  );
};

export default ExportDetailToPDF;
