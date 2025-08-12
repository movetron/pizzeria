import React from 'react';

type CategoriesProps = {
  value: number;
  onChangeCategory: (i: number) => void;
  getCategories?: (categories: string[]) => void;
};
const categories = ['Все', 'Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];

const Categories: React.FC<CategoriesProps> = ({ value, onChangeCategory }) => {
  //если будет undefined
  //   getCategories?.(categories);
  return (
    <div className="categories">
      <ul>
        {categories.map((catagoryName, i) => {
          return (
            <li key={i} onClick={() => onChangeCategory(i)} className={value === i ? 'active' : ''}>
              {catagoryName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Categories;
