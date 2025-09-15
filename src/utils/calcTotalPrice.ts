import { CartItem } from '../redux/cart/types';

export const calcTotalPrice = (items: CartItem[]): number => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, obj) => obj.price * obj.count + sum, 0);
};
