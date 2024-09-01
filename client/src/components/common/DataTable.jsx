import React from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import './DataTable.css';

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
      <DataTableExtensions {...tableData} export={true}>
        <DataTable
          pagination
          paginationComponentOptions={paginationOptions}
          className="data-table"
        />
      </DataTableExtensions>

  );
};

export default DataTableComponent;
