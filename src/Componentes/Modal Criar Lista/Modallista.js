import { useDispatch, useSelector } from "react-redux";
import {
  setModalData,
  resetModalData,
  setShowModal,
  addCard,
} from "../../redux/cardSlice";

const ModalLista = ({ show, onClose }) => {
  const dispatch = useDispatch();
  const { titulo, descricao, imagem } = useSelector((state) => state.card.modalData);

  const handleAdd = async (novaLista) => {
    try {
      const response = await fetch("http://localhost:3001/listas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaLista),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar a lista");
      }

      const savedLista = await response.json();
      dispatch(addCard(savedLista));
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar a lista");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const novaLista = {
      id: String(Date.now()),
      titulo,
      descricao: descricao || "Sem descrição",
      imagem: null,
      adquiridos: 0,
      total: 0,
      progresso: 0,
      itens: [],
    };

    if (imagem) {
      const reader = new FileReader();
      reader.onloadend = () => {
        novaLista.imagem = reader.result;
        handleAdd(novaLista);
        dispatch(resetModalData());
        dispatch(setShowModal(false));
      };
      reader.readAsDataURL(imagem);
    } else {
      handleAdd(novaLista);
      dispatch(resetModalData());
      dispatch(setShowModal(false));
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
              <h5 className="modal-title">Nova Lista</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="titulo" className="form-label">
                  Título
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="titulo"
                  maxLength="50"
                  required
                  value={titulo}
                  onChange={(e) =>
                    dispatch(setModalData({ titulo: e.target.value }))
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descricao" className="form-label">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  className="form-control"
                  maxLength="150"
                  style={{ height: "6.25rem", resize: "none" }}
                  value={descricao}
                  onChange={(e) =>
                    dispatch(setModalData({ descricao: e.target.value }))
                  }
                />
              </div>
              <div
                className="text-end text-muted mt-1"
                style={{ fontSize: "0.875rem" }}
              >
                {descricao.length}/150
              </div>
              <div className="mb-3">
                <label htmlFor="imagem" className="form-label">
                  Imagem
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="imagem"
                  accept="image/jpg, image/png, image/webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (
                      file &&
                      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
                    ) {
                      alert("Apenas imagens JPG, PNG ou WEBP são permitidas.");
                      e.target.value = "";
                      return;
                    }
                    dispatch(setModalData({ imagem: file }));
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  dispatch(resetModalData());
                  dispatch(setShowModal(false))
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn"
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                }}
              >
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
          onClick={() => dispatch(setShowModal(false))}
        ></div>
      )}
    </>
  );
};

export default ModalLista;