import React, { useEffect } from "react";
import "./NewsCategories.scss";
import { useNavigate, useLocation } from "react-router-dom";

interface NewsCategoriesProps {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
}

export const NewsCategories: React.FC<NewsCategoriesProps> = ({
  setFilter,
  setActiveCategory,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { name: "Стрічка", filter: "" },
    { name: "Популярні", filter: "popular" },
    { name: "Рекомендовані", filter: "recommended" },
  ];

  const currentCategory = categories.find((cat) => `/${cat.filter}` === location.pathname)?.name || "Стрічка";

  useEffect(() => {
    setActiveCategory(currentCategory);
  }, [currentCategory, setActiveCategory]);

  return (
    <div className="news-title">
      <h2>{currentCategory}</h2> 
      <div className="news-categories">
        {categories.map(({ name, filter }) => (
          <button
            key={filter}
            className={`btn-category ${currentCategory === name ? "active" : ""}`}
            onClick={() => {
              setFilter(filter);
              navigate(`/${filter}`);
            }}
          >
            <h3>{name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};
