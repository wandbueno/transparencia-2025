import React from 'react';
import DataTable from 'react-data-table-component';
import './DataTable.css';

const DataTableComponent = ({ columns, data }) => {
  return (
    <div className="data-table-container">
      <DataTable
        columns={columns}
        data={data}
        pagination
        className="data-table"
      />
    </div>
  );
};

export default DataTableComponent;
