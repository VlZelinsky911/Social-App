import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Приклад сторінок:
const HomePage = () => <div>Головна сторінка</div>;
const CategoriesPage = () => <div>Категорії ігор</div>;
const FavoritesPage = () => <div>Обране</div>;
const ProfilePage = () => <div>Профіль</div>;

const MainRoutes: React.FC = () => {
  return (
    <main>
      <Switch>
        <Route path="/" exact>
          <HomePage /> {/* Твоя домашня сторінка */}
        </Route>
        <Route path="/categories">
          <CategoriesPage /> {/* Сторінка категорій */}
        </Route>
        <Route path="/favorites">
          <FavoritesPage /> {/* Сторінка обраних */}
        </Route>
        <Route path="/profile">
          <ProfilePage /> {/* Сторінка профілю */}
        </Route>
      </Switch>
    </main>
  );
};

export default MainRoutes;
