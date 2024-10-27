import React, { memo } from 'react';
import '../../styles/Navbar.css';
import { NavLink } from 'react-router-dom';

const Navbar = memo(() => {
    return (
            <nav className="navbar" aria-label="Главное меню навигации">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
        Главная
      </NavLink>
            <a href="/">Тарифы</a>
            <a href="/">FAQ</a>
        </nav>
    );
});

export default Navbar;