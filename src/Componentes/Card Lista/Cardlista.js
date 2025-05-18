import React from "react";
import { Link } from "react-router-dom";

const Card = ({ id, titulo, descricao, imagem, adquiridos, total, progresso, onSolicitarExclusao }) => {
  // Calcula o progresso percentual com base nos valores recebidos

  return (
    <div className="card d-flex flex-column" style={{ height: "420px", width: "100%" }}>
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
        <div>
          <h5 className="card-title">{titulo}</h5>
          <p className="card-text mb-3" style={{ maxHeight: "5rem", overflowY: "auto" }}>
            {descricao}
          </p>
        </div>

        <div>
          <p>
            <strong>Itens:</strong> {adquiridos}/{total}
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
                width: `${progresso}%`,
                backgroundColor: "#dc3545",
                borderRadius: "10px",
                transition: "width 0.3s ease",
              }}
            ></span>
          </div>
          <div className="d-flex justify-content-between">
            <Link
              to={`/lista/${id}`}
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
              onClick={() => onSolicitarExclusao(id)}
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