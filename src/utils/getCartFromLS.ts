import { calcTotalPrice } from './calcTotalPrice';
import { calcTotalCount } from './calcTotalCount';
import { CartItem } from '../redux/cart/types';

export const getCartFromLS = () => {
  try {
    const data = localStorage.getItem('cart');

    // Если данных нет — возвращаем пустое состояние
    if (!data) {
      return {
        items: [] as CartItem[],
        totalPrice: 0,
        totalCount: 0,
      };
    }

    const parsed = JSON.parse(data);

    // Если parsed — массив, значит старая версия (только items)
    if (Array.isArray(parsed)) {
      const items = parsed;
      return {
        items: parsed as CartItem[],
        totalPrice: calcTotalPrice(items),
        totalCount: calcTotalCount(items),
      };
    }

    // Если parsed — объект, например { items: [...], totalPrice: 100 }
    if (parsed && typeof parsed === 'object') {
      const items = Array.isArray(parsed.items) ? parsed.items : [];
      return {
        items: parsed as CartItem[],
        totalPrice: calcTotalPrice(items),
        totalCount: calcTotalCount(items),
      };
    }

    // Если формат неизвестен — возвращаем пустое
    console.warn('Invalid cart data format:', parsed);
    return {
      items: [] as CartItem[],
      totalPrice: 0,
      totalCount: 0,
    };
  } catch (error) {
    // Ошибка парсинга JSON
    console.error('Failed to parse cart from localStorage', error);
    localStorage.removeItem('cart'); // очищаем битые данные
    return {
      items: [] as CartItem[],
      totalPrice: 0,
      totalCount: 0,
    };
  }
};

// import { calcTotalPrice } from './calcTotalPrice';
// import { calcTotalCount } from './calcTotalCount';
// import { CartItem } from '../redux/slices/cart/types';

// export const getCartFromLS = () => {
//   const data = localStorage.getItem('cart');
//   const items = data ? JSON.parse(data) : [];
//   const totalPrice = calcTotalPrice(items);
//   const totalCount = calcTotalCount(items);

//   if (items.length) {
//     return {
//       items: items as CartItem[],
//       totalPrice,
//       totalCount,
//     };
//   }
//   return data ? JSON.parse(data) : [];
// };
