import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cards: [],
  showModal: false,
  cardParaExcluir: null,
  modalData: {
    titulo: "",
    descricao: "",
    imagem: null,
  },
  progresso: {},
  listaAtual: null,
};

const listaSlice = createSlice({
  name: "lista",
  initialState,
  reducers: {
    setCards(state, action) { state.cards = action.payload; },
    addCard(state, action) { state.cards.push(action.payload); },
    deleteCard(state, action) { state.cards = state.cards.filter((card) => card.id !== action.payload); },
    setShowModal(state, action) { state.showModal = action.payload; },
    setCardParaExcluir(state, action) { state.cardParaExcluir = action.payload; },
    setModalData(state, action) { state.modalData = { ...state.modalData, ...action.payload }; },
    resetModalData(state) { state.modalData = { titulo: "", descricao: "", imagem: null }; },
    updateCardProgress(state, action) {
      const { id, total, adquiridos } = action.payload;
      state.progresso[id] = { total, adquiridos };
    },
    updateCard(state, action) {
      const updated = action.payload;
      state.cards = state.cards.map(card =>
        card.id === updated.id ? { ...card, ...updated } : card
      );
    },
    setListaAtual(state, action) { state.listaAtual = action.payload; },
  },
});

export const {
  setCards,
  addCard,
  deleteCard,
  setShowModal,
  setCardParaExcluir,
  setModalData,
  resetModalData,
  updateCardProgress,
  updateCard,
  setListaAtual,
} = listaSlice.actions;

export default listaSlice.reducer;