import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCardProgress } from "../../redux/cardSlice";

const Card = ({ id, titulo, descricao, imagem, onSolicitarExclusao }) => {
  const dispatch = useDispatch();
  const progresso = useSelector((state) => state.card.progresso[id]) || { total: 0, adquiridos: 0 };

  useEffect(() => {
    const itens = JSON.parse(localStorage.getItem(`itens_${id}`)) || [];
    const total = itens.length;
    const adquiridos = itens.filter((item) => item.adquirido).length;

    dispatch(updateCardProgress({ id, total, adquiridos }));
  }, [id, dispatch]);

  console.log("ID do Card (tipo):", id, typeof id);

  const progressoPercentual = progresso.total > 0 ? (progresso.adquiridos / progresso.total) * 100 : 0;

  return (
    <div
      className="card d-flex flex-column"
      style={{
        height: "420px", // altura fixa do card
        width: "100%",
      }}
    >
      {/* Imagem ou placeholder */}
      <div style={{ height: "170px", overflow: "hidden" }}>
        {imagem ? (
          <img
            src={imagem}
            alt="Imagem da lista"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            className="d-flex align-items-center justify-content-center h-100"
            style={{
              backgroundColor: "#ccc",
              color: "#555",
              fontWeight: "bold",
            }}
          >
            Lista sem imagem
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="card-body d-flex flex-column justify-content-between">
        {/* Parte superior: título + descrição */}
        <div>
          <h5 className="card-title">{titulo}</h5>
          <p
            className="card-text mb-3"
            style={{
              maxHeight: "5rem",
              overflowY: "auto",
            }}
          >
            {descricao}
          </p>
        </div>

        {/* Parte inferior: progresso e botões */}
        <div>
          <p>
            <strong>Itens:</strong> {progresso.adquiridos}/{progresso.total}
          </p>
          <div
            className="progress-bar"
            style={{
              height: "15px",
              backgroundColor: "#ddd",
              borderRadius: "10px",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                display: "block",
                height: "100%",
                width: `${progressoPercentual}%`,
                backgroundColor: "#dc3545",
                borderRadius: "10px",
                transition: "width 0.3s ease",
              }}
            ></span>
          </div>
          <div className="d-flex justify-content-between">
            <Link
              to={`/lista/${id}`} // O ID já está sendo passado como número
              className="btn"
              style={{
                backgroundColor: "white",
                color: "#dc3545",
                border: "1px solid #dc3545",
              }}
            >
              Ver Lista
            </Link>
            <button
              className="btn btn-danger"
              onClick={() => onSolicitarExclusao(id)} // O ID já está sendo passado como número
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
