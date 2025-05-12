const ModalExcluirLista = ({ show, onCancel, onConfirm }) => {
    return (
      <>
        <div className={`modal fade ${show ? 'show d-block' : 'd-none'}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Exclusão</h5>
                <button type="button" className="btn-close" onClick={onCancel}></button>
              </div>
              <div className="modal-body">
                Tem certeza que deseja excluir esta lista?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                <button className="btn btn-danger" onClick={onConfirm}>Excluir</button>
              </div>
            </div>
          </div>
        </div>
        {show && <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel}></div>}
      </>
    );
  };

  export default ModalExcluirLista