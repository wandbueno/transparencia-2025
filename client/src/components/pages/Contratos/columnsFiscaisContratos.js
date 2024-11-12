const columnsFiscaisContratos = [
  {
    header: 'Nome do Fiscal',
    accessorKey: 'nomeFiscal'
  },
  {
    header: 'CPF/CNPJ',
    accessorKey: 'cpfCnpj'
  },
  {
    header: 'Cargo',
    accessorKey: 'cargo'
  },
  {
    header: 'Portaria',
    accessorKey: 'portaria'
  },
  {
    header: 'Data da Portaria',
    accessorKey: 'dataPortaria',
    cell: ({ row }) => {
      const data = row.original.dataPortaria
      return data ? new Date(data).toLocaleDateString('pt-BR') : ''
    }
  },
  {
    header: 'Situação',
    accessorKey: 'situacao'
  }
]

export default columnsFiscaisContratos
