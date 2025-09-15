import React, { Suspense } from 'react';

import './scss/app.scss';
import Home from './pages/Home';
// import Cart from './pages/Cart';

import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const Cart = React.lazy(
  () =>
    import(/* webpackChunkName: "Cart" */ './pages/Cart') as Promise<{
      default: React.ComponentType<any>;
    }>,
);
const FullPizza = React.lazy(
  () =>
    import(/* webpackChunkName: "FullPizza" */ './pages/FullPizza') as Promise<{
      default: React.ComponentType<any>;
    }>,
);
const NotFound = React.lazy(
  () =>
    import(/* webpackChunkName: "NotFound" */ './pages/NotFound') as Promise<{
      default: React.ComponentType<any>;
    }>,
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<Home />} />
        <Route
          path="/cart"
          element={
            <Suspense fallback={<div>Идёт загрузка корзины...</div>}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path="/pizza/:id"
          element={
            <Suspense fallback={<div>Идёт загрузка...</div>}>
              <FullPizza />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<div>Идёт загрузка...</div>}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
