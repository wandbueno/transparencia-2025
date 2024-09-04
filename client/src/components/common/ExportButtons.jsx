import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import { FaFileExcel, FaFilePdf, FaFileCsv, FaFileAlt, FaPrint } from 'react-icons/fa';
import './ExportButtons.css';
import LogoPublixel from '../../assets/LogoPublixelOfc.png';

const ExportButtons = ({ data, columns }) => {
  // Função para exportar para XLS
  const exportToXLS = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'data.xlsx');
  };

  // Função para exportar para PDF com orientação paisagem
  const exportToPDF = () => {
    const doc = new jsPDF('landscape'); // Definindo orientação paisagem

    // Carregar a imagem logo como base64
    const logoImg = new Image();
    logoImg.src = LogoPublixel;

    logoImg.onload = () => {
      // Adicionar a logo na parte superior centralizada
      const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      const imgWidth = 50; // Largura da imagem
      const imgHeight = (logoImg.height / logoImg.width) * imgWidth; // Mantendo a proporção

      doc.addImage(logoImg, 'PNG', pageWidth / 2 - imgWidth / 2, 10, imgWidth, imgHeight);

      // Adicionando os textos fixos logo abaixo da imagem
      doc.setFontSize(14);
      doc.text('ESTADO DO TOCANTINS', pageWidth / 2, 10 + imgHeight + 10, { align: 'center' });
      doc.setFontSize(12);
      doc.text('PREFEITURA MUNICIPAL DE CONCEIÇÃO DO TOCANTINS', pageWidth / 2, 10 + imgHeight + 18, { align: 'center' });

      // Preparando os dados da tabela
      const tableData = data.map(row => columns.map(col => col.selector(row)));

      // Adicionando a tabela logo abaixo do texto
      doc.autoTable({
        head: [columns.map(col => col.name)],
        body: tableData,
        theme: 'striped',
        startY: 10 + imgHeight + 26, // Começando logo abaixo do texto
        margin: { top: 10 },
      });

      // Adicionando o rodapé com a data/hora e paginação em uma fonte menor
      const pageCount = doc.internal.getNumberOfPages();
      const dateStr = new Date().toLocaleString('pt-BR');
      doc.setFontSize(8);  // Reduzindo a fonte do rodapé
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Informações geradas pelo portal da transparência em ${dateStr}.`, 10, doc.internal.pageSize.height - 10);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }

      // Gerando e abrindo o PDF
      const pdfOutput = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfOutput);
      window.open(pdfUrl, '_blank');
    };
  };

  // Função para exportar para TXT
  const exportToTXT = () => {
    const header = columns.map(col => col.name).join('\t');
    const rows = data.map(row => columns.map(col => col.selector(row)).join('\t')).join('\n');
    const txt = [header, rows].join('\n');
    
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'data.txt');
  };

  // Função para imprimir a tabela
  const printTable = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Imprimir Tabela</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<h1>Minha Tabela</h1>');
    printWindow.document.write(document.querySelector('.data-table').outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="export-buttons">
      <button onClick={exportToXLS} title="Exportar para XLS">
        <div className="icon-container excel">
          <FaFileExcel />
        </div>
      </button>
      <CSVLink data={data} filename="data.csv">
        <button title="Exportar para CSV">
          <div className="icon-container csv">
            <FaFileCsv />
          </div>
        </button>
      </CSVLink>
      <button onClick={exportToPDF} title="Exportar para PDF">
        <div className="icon-container pdf">
          <FaFilePdf />
        </div>
      </button>
      <button onClick={exportToTXT} title="Exportar para TXT">
        <div className="icon-container txt">
          <FaFileAlt />
        </div>
      </button>
      <button onClick={printTable} title="Imprimir">
        <div className="icon-container print">
          <FaPrint />
        </div>
      </button>
    </div>
  );
};

export default ExportButtons;
