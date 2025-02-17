import React from "react";
import "./NewsCategories.scss";

interface NewsCategoriesProps {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
  activeCategory: string;
}

export const NewsCategories: React.FC<NewsCategoriesProps> = ({
  setFilter,
  setActiveCategory,
  activeCategory,
}) => (
  <div className="news-title">
    <h2>{activeCategory}</h2> 
    <div className="news-categories">
      {[ 
        { name: "Стрічка", filter: "all" },
        { name: "Нові", filter: "new" },
        { name: "Популярні", filter: "popular" },
        { name: "Рекомендовані", filter: "recommended" },
      ].map(({ name, filter }) => (
        <button
          key={filter}
          className={`btn-category ${activeCategory === name ? 'active' : ''}`}
          onClick={() => {
            setFilter(filter);
            setActiveCategory(name);
            console.log("Фільтр змінено на:", name);
          }}
        >
          <h3>{name}</h3>
        </button>
      ))}
    </div>
  </div>
);
