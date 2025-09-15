import { CartItem } from '../redux/cart/types';

export const calcTotalCount = (items: CartItem[]): number => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, obj) => obj.count + sum, 0);
};
