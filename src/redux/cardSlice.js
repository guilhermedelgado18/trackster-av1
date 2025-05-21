import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchListas = createAsyncThunk("card/fetchListas", async (_, { dispatch }) => {
  const response = await fetch("http://localhost:3001/listas");
  if (!response.ok) {
    throw new Error("Erro ao buscar as listas");
  }
  const listas = await response.json();

  listas.forEach((lista) => {
    dispatch(updateCardProgress({ id: lista.id, total: lista.total, adquiridos: lista.adquiridos }));
  });

  return listas;
});

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
  itens: [],
  mostrarModalItem: false,
  modalItemData: {
    nome: "",
    descricao: "",
    imagem: null,
  },
  itemEditando: null,
  mostrarModalEditarItem: false,
  itemSelecionado: null,
  comentariosModalAberto: false,
  itemParaComentar: null,
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
      console.log("Removendo card com ID:", action.payload);
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
    updateCardProgress: (state, action) => {
      const { id, total, adquiridos } = action.payload;
      state.progresso[id] = { total, adquiridos };
    },
    updateCard: (state, action) => {
      const updated = action.payload;
      state.cards = state.cards.map(card =>
        card.id === updated.id ? { ...card, ...updated } : card
      );
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
    setItemEditando(state, action) {
      state.itemEditando = action.payload;
    },
    setMostrarModalEditarItem(state, action) {
      state.mostrarModalEditarItem = action.payload;
    },
    setItemSelecionado(state, action) {
      state.itemSelecionado = action.payload;
    },
    setComentariosModalAberto(state, action) {
      state.comentariosModalAberto = action.payload;
    },
    setItemParaComentar(state, action) {
      state.itemParaComentar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListas.fulfilled, (state, action) => {
      state.cards = action.payload;
    });
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
  setItens,
  addItem,
  toggleItemAdquirido,
  removeItem,
  setMostrarModalItem,
  setModalItemData,
  resetModalItemData,
  setItemEditando,
  setMostrarModalEditarItem,
  setItemSelecionado,
  setComentariosModalAberto,
  setItemParaComentar,
} = cardSlice.actions;
export default cardSlice.reducer;