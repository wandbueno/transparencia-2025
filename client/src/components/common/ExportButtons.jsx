import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { saveAs } from 'file-saver';
import { FaFileExcel, FaFilePdf, FaFileCsv, FaFileAlt, FaPrint } from 'react-icons/fa';
import './ExportButtons.css';

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
  
    // Mapeia dados para o formato aceito pelo jsPDF
    const tableData = data.map(row => columns.map(col => col.selector(row)));
    
    doc.autoTable({
      head: [columns.map(col => col.name)],
      body: tableData,
      theme: 'striped',
      margin: { top: 10 },
    });
  
    // Gerar o PDF e abrir em uma nova aba
    const pdfOutput = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl, '_blank'); // Abre o PDF em uma nova aba
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
        <FaFileExcel className="fa-file-excel" />
      </button>
      <CSVLink data={data} filename="data.csv">
        <button title="Exportar para CSV">
          <FaFileCsv className="fa-file-csv" />
        </button>
      </CSVLink>
      <button onClick={exportToPDF} title="Exportar para PDF">
        <FaFilePdf className="fa-file-pdf" />
      </button>
      <button onClick={exportToTXT} title="Exportar para TXT">
        <FaFileAlt className="fa-file-alt" />
      </button>
      <button onClick={printTable} title="Imprimir">
        <FaPrint className="fa-print" />
      </button>
    </div>
  );
};

export default ExportButtons;
