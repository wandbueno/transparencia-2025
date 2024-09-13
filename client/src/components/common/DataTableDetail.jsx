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
      paginationComponentOptions={paginationOptions}
      className="data-table"
      noDataComponent={<div>Nenhum dado encontrado</div>} // Mensagem para quando não há dados
    />
  );
};

export default DataTableDetail;
