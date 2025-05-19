/*Guilherme*/
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Lista.css';
import Banner from "../Componentes/Banner/Banner";
import BotaoAdicionarItem from "../Componentes/Botão Adicionar Item/Botaoadicionaritem";
import ModalAdicionarItem from "../Componentes/Modal Adicionar Item/Modaladicionaritem";
import { useDispatch, useSelector } from "react-redux";
import { updateCard } from "../redux/cardSlice";
import ModalEditarItem from "../Componentes/Modal Editar Item/ModalEditarItem";
import {
  setListaAtual,
  setItens,
  setMostrarModalItem,
  updateCardProgress,
  setItemEditando,
  setMostrarModalEditarItem,
} from "../redux/cardSlice";

const Lista = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { listaAtual, itens, mostrarModalItem } = useSelector((state) => ({
    listaAtual: state.card.listaAtual,
    itens: state.card.itens,
    mostrarModalItem: state.card.mostrarModalItem,
    itemEditando: state.card.itemEditando,
    mostrarModalEditarItem: state.card.mostrarModalEditarItem,
  }));

  useEffect(() => {
    const fetchLista = async () => {
      try {
        const response = await fetch(`http://localhost:3001/listas/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar a lista");
        }
        const data = await response.json();

        dispatch(setListaAtual(data));
        dispatch(setItens(data.itens || []));

        const total = data.itens?.length || 0;
        const adquiridos = data.itens?.filter((item) => item.adquirido).length || 0;
        dispatch(updateCardProgress({ id: data.id, total, adquiridos }));
      } catch (error) {
        console.error("Erro ao buscar a lista:", error);
        alert("Erro ao buscar a lista");
      }
    };

    fetchLista();
  }, [id, dispatch]);

  const handleToggleAdquirido = async (index) => {
    try {
      const novosItens = itens.map((item, i) =>
        i === index ? { ...item, adquirido: !item.adquirido } : item
      );

      const total = novosItens.length;
      const adquiridos = novosItens.filter((item) => item.adquirido).length;

      const progresso = listaAtual.total > 0 ? (adquiridos / listaAtual.total) * 100 : 0;

      const response = await fetch(`http://localhost:3001/listas/${listaAtual.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itens: novosItens, adquiridos, progresso }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar o item no backend");
      }

      dispatch(setItens(novosItens));
      dispatch(setListaAtual({ ...listaAtual, adquiridos, progresso }));
      dispatch(updateCard({
        ...listaAtual,
        itens: novosItens,
        total,
        adquiridos,
        progresso
      }));
    } catch (error) {
      console.error("Erro ao atualizar o item:", error);
      alert("Erro ao atualizar o item");
    }
  };

  const handleRemoverItem = async (index) => {
    const confirmar = window.confirm("Tem certeza de que deseja remover este item?");
    if (!confirmar) return;

    try {

      const novosItens = itens.filter((_, i) => i !== index);

      const total = novosItens.length;
      const adquiridos = novosItens.filter((item) => item.adquirido).length;

      const progresso = total > 0 ? (adquiridos / total) * 100 : 0;

      const response = await fetch(`http://localhost:3001/listas/${listaAtual.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itens: novosItens, total, adquiridos, progresso }),
      });

      if (!response.ok) {
        throw new Error("Erro ao remover o item no backend");
      }

      dispatch(setItens(novosItens));
      dispatch(setListaAtual({ ...listaAtual, total, adquiridos, progresso }));
      dispatch(updateCard({
        ...listaAtual,
        itens: novosItens,
        total,
        adquiridos,
        progresso
      }));
    } catch (error) {
      console.error("Erro ao remover o item:", error);
      alert("Erro ao remover o item");
    }
  };

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
                onChange={() => handleToggleAdquirido(index)}
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
                className="btn btn-sm btn-secondary ms-2"
                id="btn-editar"
                onClick={() => {
                  dispatch(setItemEditando({ ...item, index }));
                  dispatch(setMostrarModalEditarItem(true));
                }}
              >
                Editar
              </button>
              
              <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={() => handleRemoverItem(index)}
            >
              Remover
            </button>
            </li>
          ))}
        </ul>

        <ModalEditarItem/>
      </div>
    </div>
  );
};

export default Lista;