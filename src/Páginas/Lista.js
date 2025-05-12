import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Lista.css'
import Banner from "../Componentes/Banner/Banner";
import BotaoAdicionarItem from "../Componentes/Botão Adicionar Item/Botaoadicionaritem";
import ModalAdicionarItem from "../Componentes/Modal Adicionar Item/Modaladicionaritem";

const Lista = () => {
  const { id } = useParams(); // ID da lista vindo da URL
  const navigate = useNavigate();

  const [lista, setLista] = useState(null);
  const [itens, setItens] = useState([]);
  const [verificado, setVerificado] = useState(false);
  const [mostrarModalItem, setMostrarModalItem] = useState(false);

  useEffect(() => {
    if (verificado) return;
  
    const listasSalvas = JSON.parse(localStorage.getItem("listas")) || [];
    const listaSelecionada = listasSalvas.find((l) => l.id === Number(id));
  
    if (!listaSelecionada) {
      alert("Lista não encontrada");
      navigate("/");
      return;
    }
  
    setLista(listaSelecionada);
    const itensSalvos = JSON.parse(localStorage.getItem(`itens_${id}`)) || [];
    setItens(itensSalvos);
    setVerificado(true);
  }, [id, navigate, verificado]);

  const salvarItens = (novosItens) => {
    setItens(novosItens);
    localStorage.setItem(`itens_${id}`, JSON.stringify(novosItens));
  };

  const alternarAdquirido = (index) => {
    const atualizados = [...itens];
    atualizados[index].adquirido = !atualizados[index].adquirido;
    salvarItens(atualizados);
  };

  const excluirItem = (index) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este item?");
    if (!confirmar) return;

    const atualizados = [...itens];
    atualizados.splice(index, 1);
    salvarItens(atualizados);
  };

  if (!lista) return null;

  const adquiridos = itens.filter((item) => item.adquirido).length;
  const progresso = itens.length > 0 ? (adquiridos / itens.length) * 100 : 0;

  return (
    <div className="p-0">
      
      <Banner/>
      <div className="container py-4">

        <BotaoAdicionarItem onClick={() => setMostrarModalItem(true)}/>
        <ModalAdicionarItem
            show={mostrarModalItem}
            onClose={() => setMostrarModalItem(false)}
            onAdd={(novoItem) => {
                const atualizados = [...itens, novoItem];
                setItens(atualizados);
                localStorage.setItem(`itens_${id}`, JSON.stringify(atualizados));
                setMostrarModalItem(false);
            }}
        />
      <button className="btn btn-outline-secondary mb-3" id="btn-voltar" onClick={() => navigate("/")}>
        ← Voltar
      </button>

      <h2>{lista.titulo}</h2>
      <p>{lista.descricao}</p>
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
              onChange={() => alternarAdquirido(index)}
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

            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={() => excluirItem(index)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>

      </div>
      
  );
};

export default Lista;
