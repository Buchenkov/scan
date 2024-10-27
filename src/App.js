import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';
import './fonts/ferry.otf';
import './fonts/InterRegular.ttf';
import './fonts/InterMedium.ttf';
import './fonts/InterBold.ttf';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import user_pic_example from './assets/user_pic_example.png';

// Ленивая загрузка компонентов
const Main = lazy(() => import('./components/Main/Main'));
const Authorization = lazy(() => import('./components/Authorization/Authorization'));
const Search = lazy(() => import('./components/Search/Search'));
const SearchResults = lazy(() => import('./components/SearchResults/SearchResults'));

function App() {
  const { isLoggedIn, checkAuthStatus } = useAuth();
  const [userTariff] = useState('beginner');
  const [userName, setUserName] = useState('');
  const [userPicture, setUserPicture] = useState(user_pic_example);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("Пользователь не залогинен!");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

//   Внутри Routes определяем маршруты для различных компонентов:

// / - компонент Main, которому передаются пропсы isLoggedIn и userTariff.
// /auth - компонент Authorization.
// /search - если пользователь аутентифицирован, отображается компонент Search, иначе - Authorization с возможностью перенаправления на /search после аутентификации.
// /results - если пользователь аутентифицирован, отображается компонент SearchResults, иначе - Authorization с возможностью перенаправления на /results после аутентификации.

  return (
    <Router>
      <div className="app-container">
        <Header
          isLoggedIn={isLoggedIn}
          userName={userName}
          setUserName={setUserName}
          userPicture={userPicture}
          setUserPicture={setUserPicture}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Main isLoggedIn={isLoggedIn} userTariff={userTariff} />} />
            <Route path="/auth" element={<Authorization />} />
            <Route
              path="/search"
              element={isLoggedIn ? <Search /> : <Authorization redirectBack="/search" />}
            />
            <Route
              path="/results"
              element={isLoggedIn ? <SearchResults /> : <Authorization redirectBack="/results" />}
            />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
