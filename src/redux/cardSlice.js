import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cards: [], // Lista de cards
  showModal: false,
  cardParaExcluir: null,
  modalData: {
    titulo: "",
    descricao: "",
    imagem: null,
  },
  progresso: {}, // Progresso de cada card (id -> { total, adquiridos })
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setCards(state, action) {
      state.cards = action.payload;
    },
    addCard(state, action) {
      state.cards.push(action.payload);
    },
    deleteCard(state, action) {
      state.cards = state.cards.filter((card) => card.id !== action.payload);
    },
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setCardParaExcluir(state, action) {
      state.cardParaExcluir = action.payload;
    },
    setModalData(state, action) {
      state.modalData = { ...state.modalData, ...action.payload };
    },
    resetModalData(state) {
      state.modalData = { titulo: "", descricao: "", imagem: null };
    },
    updateCardProgress(state, action) {
      const { id, total, adquiridos } = action.payload;
      state.progresso[id] = { total, adquiridos };
    },
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
} = cardSlice.actions;
export default cardSlice.reducer;