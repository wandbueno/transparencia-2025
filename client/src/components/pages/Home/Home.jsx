import React, { useEffect, useState } from 'react';
import { getDespesas } from "../../../services/receitasDespesas/despesas";
import { getReceitas } from "../../../services/receitasDespesas/receitas";
import './Home.css'; 

const Home = () => {
  const [despesas, setDespesas] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Variáveis para armazenar os totais de despesas
  const [valorEmpenhado, setValorEmpenhado] = useState(0);
  const [valorLiquidado, setValorLiquidado] = useState(0);
  const [valorPago, setValorPago] = useState(0);

  // Variável para armazenar o total de receitas
  const [totalReceitas, setTotalReceitas] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca as despesas
        const despesasResult = await getDespesas();
        const despesas2024 = despesasResult.registros.filter(despesa => despesa.data.includes("2024")); // Filtra as despesas de 2024

        setDespesas(despesas2024);

        // Calculando os totais das despesas
        const totalEmpenhado = despesas2024.reduce((acc, despesa) => acc + despesa.valorDoEmpenho, 0);
        const totalLiquidado = despesas2024.reduce((acc, despesa) => acc + despesa.valorDaLiquidacao, 0);
        const totalPago = despesas2024.reduce((acc, despesa) => acc + despesa.valorDoPagamento, 0);

        setValorEmpenhado(totalEmpenhado);
        setValorLiquidado(totalLiquidado);
        setValorPago(totalPago);

        // Busca as receitas
        const receitasResult = await getReceitas();
        const receitas2024 = receitasResult.registros.filter(receita => receita.chave.ano === 2024); // Filtra as receitas de 2024

        setReceitas(receitas2024);

        // Calculando o total de receitas arrecadadas
        const totalArrecadado = receitas2024.reduce((acc, receita) => acc + receita.valorAcumulado, 0);
        setTotalReceitas(totalArrecadado);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-container">
      <h2>Bem-vindo à Página Inicial</h2>
      
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p>Erro ao carregar dados: {error}</p>
      ) : (
        <div className="cards-container">
          <div className="card">
            <h3>Receitas</h3>
            <p>{totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="card">
            <h3>Despesas Empenhadas</h3>
            <p>{valorEmpenhado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="card">
            <h3>Despesas Liquidadas</h3>
            <p>{valorLiquidado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <div className="card">
            <h3>Despesas Pagas</h3>
            <p>{valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
