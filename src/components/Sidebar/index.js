import React from "react";
import css from "./style.module.css";
import { Link } from 'react-router-dom';
import logo from "./deliver.png";

const Sidebar = () => {
    return (
        // <header className={css.Toolbar}>
        //     <div>...</div>
        //     <div>logo</div>
        //     <nav>tses</nav>
        // </header>
        <aside className={css.Sidebar}>
            <div className={css.logo}>
                <img src={logo} alt="Deliver" />
            </div>
            <nav className={css.NavigationItems}>
                <ul>
                    <li><Link to="/storage">Агуулах</Link></li>
                    <li><Link to="/orders">Захиалга</Link></li>
                    <li><Link to="/reports">Тайлан</Link></li>

                </ul>
            </nav>
        </aside>
    );
}
export default Sidebar;