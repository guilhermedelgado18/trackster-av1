/*Pedro*/
import './App.css';
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Cardlista from './Componentes/Card Lista/Cardlista';
import Banner from './Componentes/Banner/Banner';
import BotaoAdicionar from './Componentes/Botão Adicionar/Botaoadicionar';
import ModalLista from './Componentes/Modal Criar Lista/Modallista';
import ModalExcluirLista from './Componentes/Modal Excluir Lista/Modalexcluilista';
import Lista from './Páginas/Lista';
import {
  setCards,
  addCard,
  deleteCard,
  setShowModal,
  setCardParaExcluir,
  updateCardProgress,
} from "./redux/cardSlice";

function App() {
  const dispatch = useDispatch();
  const { cards, showModal, cardParaExcluir } = useSelector((state) => state.card);

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const response = await fetch("http://localhost:3001/listas");
        if (!response.ok) {
          throw new Error("Erro ao buscar as listas");
        }

        const data = await response.json();
        dispatch(setCards(data));
      } catch (error) {
        console.error(error);
        alert("Erro ao buscar as listas");
      }
    };

    fetchListas();
  }, [dispatch]);

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

  const handleDelete = async (id) => {
    try {
      console.log("ID recebido para exclusão:", id);
      const response = await fetch(`http://localhost:3001/listas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir a lista");
      }

      dispatch(deleteCard(id));
      dispatch(setCardParaExcluir(null));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir a lista");
    }
  };

  const atualizarProgresso = async (id, total, adquiridos) => {
    const progresso = total > 0 ? (adquiridos / total) * 100 : 0;

    try {
      const response = await fetch(`http://localhost:3001/listas/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total, adquiridos, progresso }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar o progresso no backend");
      }

      dispatch(updateCardProgress({ id, total, adquiridos }));
    } catch (error) {
      console.error("Erro ao atualizar o progresso:", error);
      alert("Erro ao atualizar o progresso");
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="p-0">
            <Banner />
            <div className="container-fluid">
              <BotaoAdicionar onClick={() => dispatch(setShowModal(true))} />
              <ModalLista show={showModal} />

              <ModalLista
                show={showModal}
                onClose={() => dispatch(setShowModal(false))}
                handleAdd={handleAdd}
              />

              <ModalExcluirLista
                show={!!cardParaExcluir}
                onCancel={() => dispatch(setCardParaExcluir(null))} 
                onConfirm={() => handleDelete(cardParaExcluir)}
              />

              <div className="row g-4" id="listaCards">
                {cards.map((card) => (
                  <div key={card.id} className="col-6 col-md-4 col-lg-3 col-xxl-2">
                    <Cardlista
                      key={card.id}
                      {...card}
                      onSolicitarExclusao={(id) => dispatch(setCardParaExcluir(id))}
                      atualizarProgresso={atualizarProgresso}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
      />
      <Route path="/lista/:id" element={<Lista />} />
    </Routes>
  );
}

export default App;