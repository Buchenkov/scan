import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import UserBlock from './UserBlock/UserBlock';
import { useAuth } from '../../context/AuthContext';
import '../styles/Header.css';
import useWindowSize from './useWindowSize';
import logotipG from '../../assets/logotipG.svg';
import logotip from '../../assets/logotip.svg';
import fallout_menu_icon from '../../assets/fallout_menu_icon.svg';
import close_icon from '../../assets/closing-icon.png';

const Header = React.memo(({ isLoggedIn, userName, userPicture, setUserName, setUserPicture }) => {
  const { setIsLoggedIn } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 1360;
  const toggleMenuVisibility = useCallback(() => {
    setIsMenuVisible(!isMenuVisible);
  }, [isMenuVisible]);

  const navigate = useNavigate();
  const handleLoginClick = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  const handleLoginAndCloseMenu = useCallback(() => {
    handleLoginClick();
    setIsMenuVisible(false);
  }, [handleLoginClick]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenExpire = localStorage.getItem('tokenExpire');
      const now = new Date();
      if (!tokenExpire || new Date(tokenExpire) <= now) {
        setIsLoggedIn(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenExpire');
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000 * 60);
    return () => clearInterval(interval);
  }, [setIsLoggedIn]);

  const renderUserBlock = useMemo(() => {
    if (isMobile && !isMenuVisible) {
      return (
        <UserBlock
          isLoggedIn={isLoggedIn}
          userName={userName}
          userPicture={userPicture}
          setUserName={setUserName}
          setUserPicture={setUserPicture}
          isMenuVisible={isMenuVisible}
          isMobile={isMobile}
        />
      );
    }

    if (!isMobile && isLoggedIn) {
      return (
        <div className="right-section">
          <UserBlock
            isLoggedIn={isLoggedIn}
            userName={userName}
            userPicture={userPicture}
            setUserName={setUserName}
            setUserPicture={setUserPicture}
          />
        </div>
      );
    }

    return null;
  }, [isLoggedIn, userName, userPicture, setUserName, setUserPicture, isMenuVisible, isMobile]);

  return (
    <header className={isMenuVisible && isMobile ? 'menu-visible' : ''}>
      <div className="header-content">
        <img className="logotip" src={isMenuVisible && isMobile ? logotip : logotipG} alt="logotip" />
        {!isMobile && <Navbar />}
        {renderUserBlock}
        {isMobile && (
          <img
            src={isMenuVisible ? close_icon : fallout_menu_icon}
            alt="Menu"
            className="menu-icon"
            onClick={toggleMenuVisibility}
            aria-label={isMenuVisible ? 'Закрыть меню' : 'Открыть меню'}
          />
        )}
        {!isLoggedIn && !isMobile && (
          <div className="right-section">
            <div className="reg-block">
              <a href="/auth" className="reg-link login" aria-label="Зарегистрироваться">
                Зарегистрироваться
              </a>
              <div className="vertical-divider"></div>
              <button
                className="login-button"
                id="loginButton"
                onClick={handleLoginClick}
                aria-label="Войти"
              >
                Войти
              </button>
            </div>
          </div>
        )}
      </div>
      {isMenuVisible && isMobile && (
        <div className="dropdown-menu-page">
          <Navbar />
          {isLoggedIn ? (
            <UserBlock
              isLoggedIn={isLoggedIn}
              userName={userName}
              userPicture={userPicture}
              setUserName={setUserName}
              setUserPicture={setUserPicture}
              isMenuVisible={isMenuVisible}
              isMobile={isMobile}
            />
          ) : (
            <div className="reg-block">
              <a href="/auth" className="reg-link login" aria-label="Зарегистрироваться">
                Зарегистрироваться
              </a>
              <button
                className="login-button"
                id="loginButton"
                onClick={handleLoginAndCloseMenu}
                aria-label="Войти"
              >
                Войти
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
});

export default Header;
