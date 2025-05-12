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
} from "./redux/cardSlice";

function App() {
  const dispatch = useDispatch();
  const { cards, showModal, cardParaExcluir } = useSelector((state) => state.card);

  useEffect(() => {
    const saved = localStorage.getItem("listas");
    const loadedCards = saved ? JSON.parse(saved) : [];
    dispatch(setCards(loadedCards));
  }, [dispatch]);

  const handleAdd = (novaLista) => {
    dispatch(addCard(novaLista));
    localStorage.setItem("listas", JSON.stringify([...cards, novaLista]));
  };

  const handleDelete = (id) => {
    dispatch(deleteCard(id));
    const updated = cards.filter((card) => card.id !== id);
    localStorage.setItem("listas", JSON.stringify(updated));
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

              <ModalExcluirLista
                show={!!cardParaExcluir}
                onCancel={() => dispatch(setCardParaExcluir(null))}
                onConfirm={() => {
                  handleDelete(cardParaExcluir);
                  dispatch(setCardParaExcluir(null));
                }}
              />

              <div className="row g-4" id="listaCards">
                {cards.map((card) => (
                  <div key={card.id} className="col-6 col-md-4 col-lg-3 col-xxl-2">
                    <Cardlista
                      key={card.id}
                      {...card}
                      onSolicitarExclusao={(id) => dispatch(setCardParaExcluir(id))}
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
