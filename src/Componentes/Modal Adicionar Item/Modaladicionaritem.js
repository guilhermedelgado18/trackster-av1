import React, { useState } from "react";

const ModalAdicionarItem = ({ show, onClose, onAdd }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const novoItem = {
        id: Date.now(),
        nome: nome.trim(),
        descricao: descricao.trim(),
        imagem: imagem ? reader.result : null,
        adquirido: false,
      };
      onAdd(novoItem);
      setNome("");
      setDescricao("");
      setImagem(null);
      onClose();
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
              <button type="button" className="btn-close" onClick={onClose}></button>
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
                  onChange={(e) => setNome(e.target.value)}
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
                  onChange={(e) => setDescricao(e.target.value)}
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
                  onChange={(e) => setImagem(e.target.files[0])}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
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
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default ModalAdicionarItem;
