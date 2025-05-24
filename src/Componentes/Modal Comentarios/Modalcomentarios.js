import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setComentariosModalAberto,
  setItemParaComentar,
  setItens,
  setItemSelecionado,
} from "../../redux/itemSlice"; // <-- agora importa do itemSlice

const ModalComentarios = () => {
  const dispatch = useDispatch();
  const comentariosModalAberto = useSelector((state) => state.item.comentariosModalAberto);
  const itemParaComentar = useSelector((state) => state.item.itemParaComentar);
  const itens = useSelector((state) => state.item.itens);
  const listaAtual = useSelector((state) => state.lista.listaAtual);
  const itemSelecionado = useSelector((state) => state.item.itemSelecionado);

  const [novoComentario, setNovoComentario] = useState("");

  if (!comentariosModalAberto || !itemParaComentar) return null;

  const handleAddComentario = async (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    const comentario = {
      autor: "Usuário",
      texto: novoComentario,
      data: new Date().toISOString(),
    };

    const novosItens = itens.map((item) =>
      item.id === itemParaComentar.id
        ? { ...item, comentarios: [comentario, ...(item.comentarios || [])] }
        : item
    );

    await fetch(`http://localhost:3001/listas/${listaAtual.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itens: novosItens }),
    });

    dispatch(setItens(novosItens));
    dispatch(setItemParaComentar({ ...itemParaComentar, comentarios: [comentario, ...(itemParaComentar.comentarios || [])] }));

    // Atualize o preview se o item comentado for o selecionado
    if (itemSelecionado && itemSelecionado.id === itemParaComentar.id) {
      dispatch(setItemSelecionado({ ...itemParaComentar, comentarios: [comentario, ...(itemParaComentar.comentarios || [])] }));
    }

    setNovoComentario("");
  };

  function tempoDesde(dataComentario) {
    const agora = new Date();
    const comentario = new Date(dataComentario);
    const diffMs = agora - comentario; // diferença em milissegundos

    const segundos = Math.floor(diffMs / 1000);
    if (segundos < 60) return `há ${segundos} segundo${segundos !== 1 ? 's' : ''}`;

    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `há ${minutos} minuto${minutos !== 1 ? 's' : ''}`;

    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `há ${horas} hora${horas !== 1 ? 's' : ''}`;

    const dias = Math.floor(horas / 24);
    if (dias < 7) return `há ${dias} dia${dias !== 1 ? 's' : ''}`;

    const semanas = Math.floor(dias / 7);
    if (semanas < 5) return `há ${semanas} semana${semanas !== 1 ? 's' : ''}`;

    const meses = Math.floor(dias / 30);
    if (meses < 12) return `há ${meses} mês${meses !== 1 ? 'es' : ''}`;

    const anos = Math.floor(dias / 365);
    return `há ${anos} ano${anos !== 1 ? 's' : ''}`;
  }

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Comentários de {itemParaComentar.nome}</h5>
            <button type="button" className="btn-close" onClick={() => dispatch(setComentariosModalAberto(false))}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: 300, overflowY: "auto" }}>
            {(itemParaComentar.comentarios || []).length === 0 && (
              <div className="text-muted">Nenhum comentário ainda.</div>
            )}
            {(itemParaComentar.comentarios || []).map((coment, idx) => (
              <div key={idx} className="mb-2">
                <div style={{ fontWeight: "bold", fontSize: "0.95em" }}>{coment.autor}</div>
                <div style={{ fontSize: "0.95em" }}>{coment.texto}</div>
                <div style={{ fontSize: "0.8em", color: "#888" }}>{tempoDesde(coment.data)}</div>
                <hr className="my-1" />
              </div>
            ))}
          </div>
          <form className="modal-footer d-block" onSubmit={handleAddComentario}>
            <textarea
              className="form-control mb-2"
              placeholder="Digite seu comentário..."
              value={novoComentario}
              onChange={e => setNovoComentario(e.target.value)}
              rows={2}
              style={{ resize: "none" }}
              required
            />
            <button type="submit" className="btn btn-primary w-100">Comentar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalComentarios;