import { updateCard } from "../../redux/cardSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalItemData,
  resetModalItemData,
  setMostrarModalItem,
  setItens,
  setListaAtual,
} from "../../redux/cardSlice";

const ModalAdicionarItem = ({ show }) => {
  const dispatch = useDispatch();
  const { nome, descricao, imagem } = useSelector((state) => state.card.modalItemData);
  const itens = useSelector((state) => state.card.itens);
  const listaAtual = useSelector((state) => state.card.listaAtual);

  const handleAdicionarItem = async (novoItem) => {
    try {
      // Adiciona o novo item à lista de itens
      const novosItens = [...itens, { ...novoItem, adquirido: false }]; // Novo item é unchecked por padrão

      // Recalcula o total e os adquiridos
      const total = novosItens.length;
      const adquiridos = novosItens.filter((item) => item.adquirido).length;

      // Recalcula o progresso
      const progresso = total > 0 ? (adquiridos / total) * 100 : 0;

      // Atualiza o backend
      const response = await fetch(`http://localhost:3001/listas/${listaAtual.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itens: novosItens, total, adquiridos, progresso }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar o item no backend");
      }

      // Atualiza o estado global
      dispatch(setItens(novosItens));
      dispatch(setListaAtual({ ...listaAtual, total, adquiridos, progresso })); // Atualiza o progresso no estado global
      dispatch(updateCard({
        ...listaAtual,
        itens: novosItens,
        total,
        adquiridos,
        progresso
      }));
    } catch (error) {
      console.error("Erro ao adicionar o item:", error);
      alert("Erro ao adicionar o item");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const novoItem = {
        id: Date.now(),
        nome: nome.trim(),
        descricao: descricao.trim(),
        imagem: imagem ? reader.result : null,
        adquirido: false,
      };
      await handleAdicionarItem(novoItem);
      dispatch(resetModalItemData());
      dispatch(setMostrarModalItem(false));
    };

    if (imagem) {
      reader.readAsDataURL(imagem);
    } else {
      reader.onloadend();
    }
  };

  return (
    <>
      <div
        className={`modal fade ${show ? "show d-block" : "d-none"}`}
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
      >
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Novo Item</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(setMostrarModalItem(false))}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="nomeItem" className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="nomeItem"
                  required
                  maxLength="50"
                  value={nome}
                  onChange={(e) =>
                    dispatch(setModalItemData({ nome: e.target.value }))
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descricaoItem" className="form-label">Descrição</label>
                <textarea
                  id="descricaoItem"
                  className="form-control"
                  maxLength="150"
                  style={{ height: '6.25rem', resize: 'none' }}
                  value={descricao}
                  onChange={(e) =>
                    dispatch(setModalItemData({ descricao: e.target.value }))
                  }
                />
                <div className="text-end text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                  {descricao.length}/150
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="imagemItem" className="form-label">Imagem</label>
                <input
                  type="file"
                  className="form-control"
                  id="imagemItem"
                  accept="image/*"
                  onChange={(e) =>
                    dispatch(setModalItemData({ imagem: e.target.files[0] }))
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => dispatch(setMostrarModalItem(false))}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-danger">
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>

      {show && (
        <div
          className="modal-backdrop fade show"
          style={{ zIndex: 1040 }}
          onClick={() => dispatch(setMostrarModalItem(false))}
        ></div>
      )}
    </>
  );
};

export default ModalAdicionarItem;