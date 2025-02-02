import React from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import './DataTableDetail.css';
import '../../assets/global.css'

const DataTableDetail = ({ columns, data }) => {
  const tableData = {
    columns,
    data,
  };

  const paginationOptions = {
    rowsPerPageText: 'Linhas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  return (
    
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationPerPage={10}  // Define o limite de 5 resultados por página
      paginationRowsPerPageOptions={[5, 10, 15, 20]}  // Define as opções de quantos resultados por página
      paginationComponentOptions={paginationOptions}
      className="data-table"
      noDataComponent={<div>Nenhum dado encontrado</div>} // Mensagem para quando não há dados
    />
  );
};

export default DataTableDetail;
