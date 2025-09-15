import React from 'react';
import { sortList } from '../components/Sort';

import { Categories, Sort, Skeleton, PizzaBlock, Pagination } from '../components';
import { useSelector, useDispatch } from 'react-redux';

import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/filter/slice';
import { selectFilter } from '../redux/filter/seletors';
import { selectPizzaData } from '../redux/pizza/selectors';
import { fetchPizzas } from '../redux/pizza/asyncAction';
import { SearchPizzaParams } from '../redux/pizza/slice';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  //   const sortType = sort.sortProperty; // или сразу написать sort.sortProperty

  //   const [currentPage, setCurrentPage] = React.useState(1);

  const onChangeCategory = React.useCallback((id: number) => {
    dispatch(setCategoryId(id));
  }, []);
  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // fetch(
  //   `https://685c5202769de2bf085c6821.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
  // )
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((arr) => {
  //     setItems(arr); //отображение пицц
  //     setIsLoading(false); //загрузка скелетона завершилась(чтобы бесконечно не грузилось), скрывает
  //   });

  const getPizzas = async () => {
    // setIsLoading(true); //перед отправкой запроса, начинается загрузка

    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    // await axios
    //   .get(
    //     `https://685c5202769de2bf085c6821.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
    //   )
    //   .then((res) => {
    //     setItems(res.data);
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     setIsLoading(false);
    //   });

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );

    window.scrollTo(0, 0);
  };

  // Если изменили параметры и был первый рендер
  React.useEffect(() => {
    // Теперь параметры в адресной строке браузере обновляються и старые данные удаляються

    // если был первый рендер
    if (isMounted.current) {
      const params = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });
      const queryString = qs.stringify(params, { skipNulls: true });
      navigate(`?${queryString}`);
    }
    if (!window.location.search) {
      dispatch(fetchPizzas({} as SearchPizzaParams));
    }
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  //есть ли в url параметра
  //если был первый рендер, то проверяем url памаметры и сохраняем в редаксе. На второй рендер будет true и действие выполниться
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams; //substring(1) - убираем вопросительный знак в начале
      const sort = sortList.find((obj) => obj.sortProperty == params.sortBy);
      dispatch(
        setFilters({
          searchValue: params.search,
          categoryId: Number(params.category),
          currentPage: Number(params.currentPage),
          sort: sort || sortList[0],
        }),
      );
    }
    isSearch.current = true;
  }, []);

  // Если был первый рендер, то запрашиваем пиццы
  React.useEffect(() => {
    //если нет поиска по params параметрам
    // при первом рендрере ничего не делай, жди. Нужно проверить что параметры придут из url
    getPizzas();
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>
            Произошла ошибка <span>😕</span>
          </h2>
          <p>К сожелению не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
