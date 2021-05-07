import React from 'react'
import {NavLink} from 'react-router-dom';
import SearchBar from './SearchBar.jsx';

 const NavBar = () => {
    return (
        <nav className='navbar navbar-expand-lg navbar-mainbg'>
           <NavLink className='navbar-brand navbar-logo' to="/">
                Nav Bar
           </NavLink>
           <SearchBar/>
            <div
            className='collapse navbar-collapse'
            id='navbarSupportedContent'>
                <ul className='navbar-nav ml-auto'>
                    <div className='hori-selector'>
                       <div className='left'></div>
                       <div className='right'></div>
                    </div>
                    <li className='nav-item active'>
                        <NavLink classname='nav-link' to='/' exact>
                            <i className='fasfa-tachometer-alt'>Home</i>
                        </NavLink>
                    </li>

                    <li className='nav-item active'>
                        <NavLink classname='nav-link' to='/AboutUs' exact>
                            <i className='fasfa-tachometer-alt'>About Us</i>
                        </NavLink>
                    </li>

                    <li className='nav-item active'>
                        <NavLink classname='nav-link' to='/Catalogue' exact>
                            <i className='fasfa-tachometer-alt'>Catalogue</i>
                        </NavLink>
                    </li>

                    <li className='nav-item active'>
                        <NavLink classname='nav-link' to='/Contact' exact>
                            <i className='fasfa-tachometer-alt'>Contact</i>
                        </NavLink>
                    </li>
                </ul>
                
            </div>
        </nav>
    )
}


export default NavBar;