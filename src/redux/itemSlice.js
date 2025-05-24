import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itens: [],
  mostrarModalItem: false,
  modalItemData: { nome: "", descricao: "", imagem: null },
  itemEditando: null,
  mostrarModalEditarItem: false,
  itemSelecionado: null,
  comentariosModalAberto: false,
  itemParaComentar: null,
  modalAvaliacaoAberto: false,
  itemAvaliando: null,
  notaAvaliacao: 0,
  comentarioAvaliacao: "",
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setItens(state, action) { state.itens = action.payload; },
    addItem(state, action) { state.itens.push(action.payload); },
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
    setMostrarModalItem(state, action) { state.mostrarModalItem = action.payload; },
    setModalItemData(state, action) { state.modalItemData = { ...state.modalItemData, ...action.payload }; },
    resetModalItemData(state) { state.modalItemData = { nome: "", descricao: "", imagem: null }; },
    setItemEditando(state, action) { state.itemEditando = action.payload; },
    setMostrarModalEditarItem(state, action) { state.mostrarModalEditarItem = action.payload; },
    setItemSelecionado(state, action) { state.itemSelecionado = action.payload; },
    setComentariosModalAberto(state, action) { state.comentariosModalAberto = action.payload; },
    setItemParaComentar(state, action) { state.itemParaComentar = action.payload; },
    setModalAvaliacaoAberto(state, action) { state.modalAvaliacaoAberto = action.payload; },
    setItemAvaliando(state, action) { state.itemAvaliando = action.payload; },
    setNotaAvaliacao(state, action) { state.notaAvaliacao = action.payload; },
    setComentarioAvaliacao(state, action) { state.comentarioAvaliacao = action.payload; },
    resetAvaliacao(state) {
      state.notaAvaliacao = 0;
      state.comentarioAvaliacao = "";
      state.itemAvaliando = null;
      state.modalAvaliacaoAberto = false;
    },
  },
});

export const {
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
  setModalAvaliacaoAberto,
  setItemAvaliando,
  setNotaAvaliacao,
  setComentarioAvaliacao,
  resetAvaliacao,
} = itemSlice.actions;

export default itemSlice.reducer;