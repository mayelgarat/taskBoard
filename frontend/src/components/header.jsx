
import React from "react";
import LOGO from '../img/logo.webp'

import '../styles/header.scss';

const Header = () => {
    const onHireMeClick = () => {
        window.location.href = 'mailto:mayelgarat1@gmail.com?subject=Triolla%20Job%20Offer%20%3A%29';
    }

    return <div className='header'>
        <img src={LOGO}></img>
        <button className='hire-me-btn' onClick={onHireMeClick}>Hire Me</button>
    </div>

}

export default Header;
