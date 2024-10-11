import React from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import './DataTable.css';
import '../../assets/global.css'
import ExportButtons from './ExportButtons';

const DataTableComponent = ({ columns, data }) => {
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
    <>
    {/* <ExportButtons data={data} columns={columns} />
     */}
     <div>
    {data && data.length > 0 ? (
      <div>
        {/* Renderiza a tabela e os botões de exportação */}
        <ExportButtons data={data} columns={columns} />
      </div>
    ) : (
      <div>Nenhum dado disponível</div> // Ou algum spinner de carregamento
    )}
  </div>
  
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationPerPage={15}
      paginationComponentOptions={paginationOptions}
      className="data-table"
      noDataComponent={<div>Nenhum dado encontrado</div>} // Mensagem para quando não há dados
    />
    </>
  );
};

export default DataTableComponent;
