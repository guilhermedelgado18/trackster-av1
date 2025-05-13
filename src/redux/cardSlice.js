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
  listaAtual: null, // Dados da lista atual
  itens: [], // Itens da lista atual
  mostrarModalItem: false, // Estado do modal de adicionar item
  itens: [], // Itens da lista atual
  mostrarModalItem: false, // Estado do modal de adicionar item
  modalItemData: {
    nome: "",
    descricao: "",
    imagem: null,
  },
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
      console.log("Removendo card com ID:", action.payload); // Log para debug
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
    setListaAtual(state, action) {
      state.listaAtual = action.payload;
    },
    setItens(state, action) {
      state.itens = action.payload;
    },
    addItem(state, action) {
      state.itens.push(action.payload);
    },
    toggleItemAdquirido(state, action) {
      const index = action.payload;
      if (state.itens[index]) {
        state.itens[index].adquirido = !state.itens[index].adquirido;
      }
    },
    removeItem(state, action) {
      const index = action.payload;
      if (state.itens[index]) {
        state.itens.splice(index, 1);
      }
    },
    setMostrarModalItem(state, action) {
      state.mostrarModalItem = action.payload;
    },
    setModalItemData(state, action) {
      state.modalItemData = { ...state.modalItemData, ...action.payload };
    },
    resetModalItemData(state) {
      state.modalItemData = { nome: "", descricao: "", imagem: null };
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
  setListaAtual,
  setItens,
  addItem,
  toggleItemAdquirido,
  removeItem,
  setMostrarModalItem,
  setModalItemData,
  resetModalItemData
} = cardSlice.actions;
export default cardSlice.reducer;