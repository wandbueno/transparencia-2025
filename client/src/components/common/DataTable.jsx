import React from 'react';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import './DataTable.css';
import '../../assets/global.css'
import ExportButtons from './ExportButtons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSearch } from '@fortawesome/free-solid-svg-icons';

const DataTableComponent = ({ columns, data }) => {
  const paginationOptions = {
    rowsPerPageText: 'Linhas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const NoDataMessage = () => (
    <div className="no-data-message">
      <h3>Nenhum dado encontrado</h3>
      <p>Tente realizar a pesquisa novamente utilizando outros campos ou critérios diferentes.</p>
      <div className="no-data-link">
        <p>
          Você também pode{' '}
          <a href="/transparencia/declaracoes">
            acessar nossas declarações
          </a>
          {' '}para mais informações sobre a disponibilidade dos dados.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {data && data.length > 0 ? (
        <div>
          <ExportButtons data={data} columns={columns} />
          <DataTable
            columns={columns}
            data={data}
            pagination
            paginationPerPage={15}
            paginationComponentOptions={paginationOptions}
            className="data-table"
            noDataComponent={<NoDataMessage />}
          />
        </div>
      ) : (
        <NoDataMessage />
      )}
    </>
  );
};

export default DataTableComponent;