import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCartFromLS } from '../../utils/getCartFromLS';
import { calcTotalPrice } from '../../utils/calcTotalPrice';
import { calcTotalCount } from '../../utils/calcTotalCount';
import { CartSliceState, CartItem } from './types';

const { items, totalPrice, totalCount } = getCartFromLS();

const initialState: CartSliceState = {
  totalPrice,
  totalCount,
  items,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    //чтобы не дублировались объекты, при добавлении одного и тоже товара
    addItem(state, action: PayloadAction<CartItem>) {
      //найди объект в массиве
      const findItem = state.items.find((obj) => obj.id === action.payload.id);
      //увеличь этот объект
      if (findItem) {
        findItem.count++;
      } else {
        //если его нет, то будем добавлять новый объект
        state.items.push({ ...action.payload, count: 1 });
      }
      state.totalPrice = calcTotalPrice(state.items);
      state.totalCount = calcTotalCount(state.items);
    },
    minusItem(state, action: PayloadAction<string>) {
      //   state.items = state.items.filter((obj) => obj.count !== 0);
      const findItem = state.items.find((obj) => obj.id === action.payload);
      if (findItem) {
        findItem.count--;
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((obj) => obj.id === action.payload);
      state.totalPrice = calcTotalPrice(state.items);
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addItem, removeItem, minusItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;
