import { useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Lista.css';
import Banner from "../Componentes/Banner/Banner";
import BotaoAdicionarItem from "../Componentes/Botão Adicionar Item/Botaoadicionaritem";
import ModalAdicionarItem from "../Componentes/Modal Adicionar Item/Modaladicionaritem";
import { useDispatch, useSelector } from "react-redux";
import { setComentariosModalAberto, setItemParaComentar, setModalAvaliacaoAberto, updateCard } from "../redux/cardSlice";
import ModalEditarItem from "../Componentes/Modal Editar Item/ModalEditarItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import ModalComentarios from "../Componentes/Modal Comentarios/Modalcomentarios";
import ModalAvaliacao from "../Componentes/Modal Avaliações/Modalavaliacao";
import AvaliacaoEstrelas from "../Componentes/Estrelas/Estrelas";
import {
  setListaAtual,
  setItens,
  setMostrarModalItem,
  updateCardProgress,
  setItemEditando,
  setMostrarModalEditarItem,
  setItemSelecionado,
  setItemAvaliando,
} from "../redux/cardSlice";

const Lista = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { listaAtual, itens, mostrarModalItem, itemSelecionado } = useSelector((state) => ({
    listaAtual: state.card.listaAtual,
    itens: state.card.itens,
    mostrarModalItem: state.card.mostrarModalItem,
    itemEditando: state.card.itemEditando,
    mostrarModalEditarItem: state.card.mostrarModalEditarItem,
    itemSelecionado: state.card.itemSelecionado,
  }));

  const mediaAvaliacao = itemSelecionado && itemSelecionado.avaliacoes && itemSelecionado.avaliacoes.length > 0
    ? (itemSelecionado.avaliacoes.reduce((acc, a) => acc + a.nota, 0) / itemSelecionado.avaliacoes.length)
    : 0;

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

      // Atualize o preview se o item selecionado foi alterado
      if (itemSelecionado && itemSelecionado.id === itens[index].id) {
        dispatch(setItemSelecionado({ ...novosItens[index] }));
      }
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

        <div style={{ display: "flex", position: "relative" }}>
          {/* Lista de itens */}
          <div style={{ flex: 7 }}>
            <ul className="list-group">
              {itens.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex align-items-center"
                  style={{
                    cursor: "pointer",
                    background: itemSelecionado && itemSelecionado.id === item.id ? "#f0f0f0" : "white",
                  }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={item.adquirido}
                    onChange={() => handleToggleAdquirido(index)}
                    // Não seleciona o item ao clicar na checkbox
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
                  {/* Só seleciona ao clicar fora da checkbox */}
                  <div
                    style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}
                    onClick={() => dispatch(setItemSelecionado(item))}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong>{item.nome}</strong>
                      <br />
                      <textarea
                        readOnly
                        className="form-control"
                        id="caixa-texto-item"
                        style={{
                          backgroundColor: itemSelecionado && itemSelecionado.id === item.id ? "#f0f0f0" : "white"
                        }}
                        value={item.descricao || "Sem descrição"}
                      ></textarea>
                    </div>
                    <div
                      className="icones"
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginLeft: "16px",
                        flexShrink: 0,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        id="icone-editar-item"
                        title="Editar"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setItemEditando({ ...item, index }));
                          dispatch(setMostrarModalEditarItem(true));
                        }}
                        style={{ cursor: "pointer" }}
                      />

                      <FontAwesomeIcon
                        icon={faTrash}
                        id="icone-remover-item"
                        title="Remover"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoverItem(index);
                        }}
                        style={{ cursor: "pointer" }}
                      />

                      <FontAwesomeIcon 
                        icon={faComment}
                        id="icone-comentar-item"
                        title="Comentários"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setItemParaComentar(itemSelecionado));
                          dispatch(setComentariosModalAberto(true));
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Card de preview */}
          <div style={{ flex: 3}}>
            {itemSelecionado ? (
              <div
                className="card"
                style={{
                  padding: "24px",
                  borderRadius: "1rem",
                  boxShadow: "0 2px 12px #0001",
                  minWidth: 280,
                  maxWidth: 350,
                  background: "#fff",
                  marginLeft: "auto",
                  position: "sticky",
                  top: "1rem"
                }}
              >
                <img
                  src={itemSelecionado.imagem || "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"}
                  alt=""
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "contain",
                    borderRadius: "0.5rem",
                    marginBottom: "16px",
                  }}
                />
                <h4>{itemSelecionado.nome}</h4>
                <p className="text-muted">{itemSelecionado.descricao || "Sem descrição"}</p>
                <div style={{marginBottom: "16px"}}>
                  <strong>Status:</strong>{" "}
                  {itemSelecionado.adquirido === true ? (
                    <span style={{ color: "#198754" }}>Adquirido</span>
                  ) : (
                    <span style={{ color: "#dc3545" }}>Não adquirido</span>
                  )}
                </div>
                <p 
                  onClick={() => {
                    dispatch(setItemParaComentar(itemSelecionado));
                    dispatch(setComentariosModalAberto(true));
                  }}
                  ><span
                    style={{
                      marginBottom: "20px", 
                      color: "#0066da", 
                      cursor: "pointer", 
                      display: "inline"}}>
                        Comentários({itemSelecionado.comentarios ? itemSelecionado.comentarios.length : 0})
                  </span>
                </p>

                <div style={{ display: "flex", alignItems: "center", marginBottom: 0, gap: 4}}>
                  <AvaliacaoEstrelas
                    media={mediaAvaliacao}
                    onClick={() => {
                      dispatch(setItemAvaliando(itemSelecionado));
                      dispatch(setModalAvaliacaoAberto(true))
                    }}
                  />
                  <span 
                    style={{cursor: "pointer", marginLeft: 0, fontWeight: "bold" }}
                    onClick={() => {
                      dispatch(setItemAvaliando(itemSelecionado));
                      dispatch(setModalAvaliacaoAberto(true))
                    }}  
                  >
                    ({itemSelecionado.avaliacoes ? itemSelecionado.avaliacoes.length : 0})
                  </span>
                </div>
                
                <ModalAvaliacao
                />
              </div>
            ) : (
              <div
                className="card text-muted d-flex align-items-center justify-content-center"
                style={{
                  minWidth: 280,
                  maxWidth: 350,
                  minHeight: 250,
                  borderRadius: "1rem",
                  boxShadow: "0 2px 12px #0001",
                  background: "#f8f9fa",
                  textAlign: "center",
                  padding: "32px",
                  marginLeft: "auto",
                }}
              >
                Selecione um item para ver detalhes
              </div>
            )}
          </div>
        </div>

        <ModalEditarItem/>
        <ModalComentarios/>
      </div>
    </div>
  );
};

export default Lista;