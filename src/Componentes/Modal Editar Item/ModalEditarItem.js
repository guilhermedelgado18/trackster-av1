import './ModalEditarItem.css';
import { useDispatch, useSelector } from "react-redux";
import {
  setItemEditando,
  setMostrarModalEditarItem,
  setItens,
  setListaAtual,
  updateCard,
} from "../../redux/cardSlice";

const ModalEditarItem = () => {
  const dispatch = useDispatch();
  const { mostrarModalEditarItem, itemEditando, itens, listaAtual } = useSelector((state) => ({
    mostrarModalEditarItem: state.card.mostrarModalEditarItem,
    itemEditando: state.card.itemEditando,
    itens: state.card.itens,
    listaAtual: state.card.listaAtual,
  }));

  if (!mostrarModalEditarItem || !itemEditando) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const novosItens = itens.map((item, i) =>
      i === itemEditando.index ? itemEditando : item
    );
    const total = novosItens.length;
    const adquiridos = novosItens.filter((item) => item.adquirido).length;
    const progresso = total > 0 ? (adquiridos / total) * 100 : 0;
    await fetch(`http://localhost:3001/listas/${listaAtual.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itens: novosItens, total, adquiridos, progresso }),
    });
    dispatch(setItens(novosItens));
    dispatch(setListaAtual({ ...listaAtual, itens: novosItens, total, adquiridos, progresso }));
    dispatch(updateCard({
      ...listaAtual,
      itens: novosItens,
      total,
      adquiridos,
      progresso
    }));
    dispatch(setMostrarModalEditarItem(false));
    dispatch(setItemEditando(null));
  };

  const handleClose = () => {
    dispatch(setMostrarModalEditarItem(false));
    dispatch(setItemEditando(null));
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Editar Item</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <input
              className="form-control mb-2"
              value={itemEditando.nome || ""}
              onChange={e => dispatch(setItemEditando({ ...itemEditando, nome: e.target.value }))}
              placeholder="Novo Nome"
              required
            />
            <textarea
              className="form-control mb-2"
              maxLength="150"
              value={itemEditando.descricao || ""}
              onChange={e => dispatch(setItemEditando({ ...itemEditando, descricao: e.target.value }))}
              placeholder="Nova Descrição"
            />
            <div className="text-end text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                  {itemEditando.descricao.length}/150
            </div>
            <input
              type="file"
              className="form-control"
              accept="image/jpeg, image/png, image/webp"
              onChange={e => {
                const file = e.target.files[0];
                if (
                  file &&
                  !["image/jpeg", "image/png", "image/webp"].includes(file.type)
                ) {
                  alert("Apenas imagens JPG, PNG ou WEBP são permitidas.");
                  e.target.value = "";
                  return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                  dispatch(setItemEditando({ ...itemEditando, imagem: ev.target.result }));
                };
                if (file) reader.readAsDataURL(file);
              }}
            />
            <div className="d-flex align-items-center mt-2">
              <img
                src={
                  itemEditando.imagem ||
                  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
                }
                alt="Preview"
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => dispatch(setItemEditando({ ...itemEditando, imagem: null }))}
              >
                Remover Imagem
              </button>
            </div>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" id="btn-salvar-editar-item">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarItem;