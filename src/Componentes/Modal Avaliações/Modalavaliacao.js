import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setItens,
  setItemSelecionado,
  setNotaAvaliacao,
  setComentarioAvaliacao,
  resetAvaliacao,
} from "../../redux/cardSlice";

const ModalAvaliacao = () => {
  const dispatch = useDispatch();
  const {
    modalAvaliacaoAberto,
    itemAvaliando,
    notaAvaliacao,
    comentarioAvaliacao,
    itens,
    listaAtual,
  } = useSelector(state => ({
    modalAvaliacaoAberto: state.card.modalAvaliacaoAberto,
    itemAvaliando: state.card.itemAvaliando,
    notaAvaliacao: state.card.notaAvaliacao,
    comentarioAvaliacao: state.card.comentarioAvaliacao,
    itens: state.card.itens,
    listaAtual: state.card.listaAtual,
  }));

  if (!modalAvaliacaoAberto || !itemAvaliando) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (notaAvaliacao < 1 || notaAvaliacao > 5) return;

    const avaliacao = {
      usuario: "Usuário",
      nota: notaAvaliacao,
      comentario: comentarioAvaliacao,
      data: new Date().toISOString(),
    };

    const novosItens = itens.map((it) =>
      it.id === itemAvaliando.id
        ? { ...it, avaliacoes: [avaliacao, ...(it.avaliacoes || [])] }
        : it
    );

    await fetch(`http://localhost:3001/listas/${listaAtual.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itens: novosItens }),
    });

    dispatch(setItens(novosItens));
    dispatch(setItemSelecionado({ ...itemAvaliando, avaliacoes: [avaliacao, ...(itemAvaliando.avaliacoes || [])] }));
    dispatch(resetAvaliacao());
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Avaliar {itemAvaliando.nome}</h5>
            <button type="button" className="btn-close" onClick={() => dispatch(resetAvaliacao())}></button>
          </div>
          <div className="modal-body">
            <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <svg
                  key={n}
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  style={{ cursor: "pointer", display: "block" }}
                  onClick={() => dispatch(setNotaAvaliacao(n))}
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    fill={notaAvaliacao >= n ? "#FFD700" : "#ccc"}
                    stroke="none"
                    strokeWidth="0"
                  />
                </svg>
              ))}
            </div>
            <textarea
              className="form-control"
              placeholder="Deixe um comentário (opcional)"
              value={comentarioAvaliacao}
              onChange={e => dispatch(setComentarioAvaliacao(e.target.value))}
              rows={3}
            />
            {itemAvaliando.avaliacoes && itemAvaliando.avaliacoes.length > 0 && (
              <div style={{ maxHeight: 150, overflowY: "auto", marginTop: 16 }}>
                <strong>Avaliações anteriores:</strong>
                {itemAvaliando.avaliacoes.map((av, idx) => (
                  <div key={idx} style={{ borderBottom: "1px solid #eee", padding: 4 }}>
                    <span>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <svg
                          key={n}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          style={{ display: "inline-block", verticalAlign: "middle" }}
                        >
                          <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                            fill={av.nota >= n ? "#FFD700" : "#ccc"}
                            stroke="none"
                            strokeWidth="0"
                          />
                        </svg>
                      ))}
                    </span>
                    <span style={{ fontSize: "0.9em", color: "#888", marginLeft: 8 }}>
                      {new Date(av.data).toLocaleString()}
                    </span>
                    <div>{av.comentario}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => dispatch(resetAvaliacao())}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={notaAvaliacao === 0}>Enviar Avaliação</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAvaliacao;