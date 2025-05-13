import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Lista.css';
import Banner from "../Componentes/Banner/Banner";
import BotaoAdicionarItem from "../Componentes/Botão Adicionar Item/Botaoadicionaritem";
import ModalAdicionarItem from "../Componentes/Modal Adicionar Item/Modaladicionaritem";
import { useDispatch, useSelector } from "react-redux";
import {
  setListaAtual,
  setItens,
  setMostrarModalItem,
} from "../redux/cardSlice";

const Lista = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { listaAtual, itens, mostrarModalItem } = useSelector((state) => ({
    listaAtual: state.card.listaAtual,
    itens: state.card.itens,
    mostrarModalItem: state.card.mostrarModalItem,
  }));

  useEffect(() => {
    const fetchLista = async () => {
      try {
        const numericId = Number(id); // Converte o ID para número
        console.log("Buscando lista com ID:", numericId, typeof numericId); // Log do ID e tipo
        const response = await fetch(`http://localhost:3001/listas?id=${numericId}`);
        console.log("Resposta da API:", response); // Log da resposta
        if (!response.ok) {
          throw new Error("Erro ao buscar a lista");
        }
        const data = await response.json();
        console.log("Dados recebidos:", data); // Log dos dados
        dispatch(setListaAtual(data));
        dispatch(setItens(data.itens || []));
      } catch (error) {
        console.error(error);
        alert("Erro ao buscar a lista");
        navigate("/");
      }
    };

    fetchLista();
  }, [id, navigate, dispatch]);

  if (!listaAtual) return null;

  const adquiridos = itens.filter((item) => item.adquirido).length;
  const progresso = itens.length > 0 ? (adquiridos / itens.length) * 100 : 0;

  return (
    <div className="p-0">
      <Banner />
      <div className="container py-4">
        <BotaoAdicionarItem onClick={() => dispatch(setMostrarModalItem(true))} />
        <ModalAdicionarItem show={mostrarModalItem} />
        <button
          className="btn btn-outline-secondary mb-3"
          id="btn-voltar"
          onClick={() => navigate("/")}
        >
          ← Voltar
        </button>

        <h2>{listaAtual.titulo}</h2>
        <p>{listaAtual.descricao}</p>
        <p>
          <strong>Itens:</strong> {adquiridos}/{itens.length}
        </p>

        <div
          className="progress-bar mb-4"
          style={{
            height: "15px",
            backgroundColor: "#ddd",
            borderRadius: "10px",
          }}
        >
          <span
            style={{
              display: "block",
              height: "100%",
              width: `${progresso}%`,
              backgroundColor: "#dc3545",
              borderRadius: "10px",
            }}
          ></span>
        </div>

        <ul className="list-group">
          {itens.map((item, index) => (
            <li
              key={index}
              className="list-group-item d-flex align-items-center"
            >
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={item.adquirido}
                onChange={() => {}}
              />

              <img
                src={
                  item.imagem ||
                  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                }
                alt=""
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "0.5rem",
                  marginRight: "10px",
                }}
              />

              <div className="flex-grow-1">
                <strong>{item.nome}</strong>
                <br />
                <textarea
                  readOnly
                  className="form-control"
                  id="caixa-texto-item"
                  style={{
                    border: "none",
                    resize: "none",
                    outline: "none",
                    width: "100%",
                  }}
                  value={item.descricao || "Sem descrição"}
                ></textarea>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Lista;