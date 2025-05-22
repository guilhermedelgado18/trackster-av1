import React from "react";

const AvaliacaoEstrelas = ({ media = 0, onClick }) => {
  // Arredonda para o meio mais próximo (ex: 3.2 => 3, 3.7 => 3.5)
  const arredondada = Math.round(media * 2) / 2;

  return (
    <div style={{ display: "flex", gap: 2, cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      {[1, 2, 3, 4, 5].map((n) => {
        let fill = "#ccc";
        let stroke = "none";
        if (arredondada >= n) {
          fill = "#FFD700";
          stroke = "none";
        } else if (arredondada + 0.5 === n) {
          fill = "url(#meia-estrela)";
          stroke = "none";
        }

        return (
          <svg
            key={n}
            width="28"
            height="28"
            viewBox="0 0 24 24"
            style={{ display: "block" }}
          >
            <defs>
              <linearGradient id="meia-estrela" x1="0" x2="1" y1="0" y2="0">
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#ccc" />
              </linearGradient>
            </defs>
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={fill}
              stroke={stroke}
              strokeWidth="0"
            />
          </svg>
        );
      })}
    </div>
  );
};

export default AvaliacaoEstrelas;