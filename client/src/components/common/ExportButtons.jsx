import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import { FaFileExcel, FaFilePdf, FaFileCsv, FaFileAlt, FaPrint } from 'react-icons/fa';
import './ExportButtons.css';
import LogoPublixel from '../../assets/LogoPublixelOfc.png';
import { config } from '../../assets/config.js';

const ExportButtons = ({ data, columns }) => {
  // Função para exportar para Excel
  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Dados');
  
      // Adicionar cabeçalhos
      worksheet.columns = columns.map(col => ({ header: col.name, key: col.selector }));
  
      // Adicionar dados
      data.forEach(item => {
        worksheet.addRow(columns.map(col => col.selector(item)));
      });
  
      // Gerar o arquivo XLSX e salvar
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'data.xlsx');
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
    }
  };

  // Função para exportar para PDF com orientação paisagem
  const exportToPDF = () => {
    const doc = new jsPDF('landscape'); // Definindo orientação paisagem
  
    // Carregar a imagem do logo a partir do config
    const logoImg = new Image();
    logoImg.src = config.geral.logotipo;
  
    logoImg.onload = () => {
      // Adicionar a logo na parte superior centralizada
      const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      const imgWidth = 50; // Largura da imagem
      const imgHeight = (logoImg.height / logoImg.width) * imgWidth; // Mantendo a proporção
  
      // Adicionar a logo e o título da página no PDF
      doc.addImage(logoImg, 'PNG', pageWidth / 2 - imgWidth / 2, 10, imgWidth, imgHeight);
      
      // Título da página exportada
      const pageTitle = document.title || 'Exportação de Dados';
  
      doc.setFontSize(14);
      doc.text(config.geral.nomeOrgao, pageWidth / 2, 10 + imgHeight + 10, { align: 'center' });
      doc.setFontSize(12);
      doc.text(config.geral.descricaoOrgao, pageWidth / 2, 10 + imgHeight + 18, { align: 'center' });
      doc.setFontSize(10);
      doc.text(pageTitle, pageWidth / 2, 10 + imgHeight + 28, { align: 'center' });  // Título da página
  
      // Preparando os dados da tabela
      const tableData = data.map(row => columns.map(col => col.selector(row)));
  
      // Adicionando a tabela logo abaixo do texto
      doc.autoTable({
        head: [columns.map(col => col.name)],
        body: tableData,
        theme: 'striped',
        startY: 10 + imgHeight + 36, // Começando logo abaixo do título
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
    // Cria uma nova janela para impressão
    const printWindow = window.open('', '', 'height=600,width=800');
  
    // Nome da página dinâmica
    const pageTitle = document.title || 'Tabela';
  
    // Função para gerar o HTML para logo e dados do órgão
    const generateHeaderHtml = () => {
      const { logotipo, nomeOrgao, descricaoOrgao } = config.geral;
      const logoUrl = logotipo;
  
      return `
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="Logo" style="width: 200px; height: auto;" />
          <h1 style="font-size: 18px; margin: 10px;">${nomeOrgao}</h1>
          <h2 style="font-size: 14px; margin: 0;">${descricaoOrgao}</h2>
        </div>
      `;
    };
  
    // Configuração do HTML da impressão
     // Configuração do HTML da impressão
     printWindow.document.write('<html><head><title>Imprimir Dados</title>');
     printWindow.document.write('<style>');
     printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }'); // Ajusta o tamanho da fonte do corpo
     printWindow.document.write('.data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }'); // Ajusta o tamanho da fonte da tabela
     printWindow.document.write('.data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
     printWindow.document.write('.data-table th { background-color: #f4f4f4; }');
     printWindow.document.write('</style></head><body>');
    
    // Adiciona o header com logo e dados do órgão
    printWindow.document.write(generateHeaderHtml());
    
    // Cria o HTML da tabela com todos os dados e colunas
    const tableHtml = `
      <h3>${pageTitle}</h3>
      <table class="data-table">
        <thead>
          <tr>${columns.map(col => `<th>${col.name}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${data.map(row => 
            `<tr>${columns.map(col => `<td>${col.selector(row)}</td>`).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
    `;
    
    // Adiciona o HTML gerado à nova janela
    printWindow.document.write(tableHtml);  
  
    // Fecha o documento e inicia a impressão
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="export-buttons">
      <button onClick={exportToExcel} title="Exportar para Excel">
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
