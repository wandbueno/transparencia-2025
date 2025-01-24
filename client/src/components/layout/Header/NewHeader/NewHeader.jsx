import React, { useState } from 'react';
import NewMenuPrincipal from './NewMenuPrincipal';
import NewMegaMenu from './NewMegaMenu';
import { useLocation } from 'react-router-dom';
import './NewHeader.css';
import HeaderPrincipal from '../HeaderPrincipal';

const NewHeader = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const closeMenu = () => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
  };

  const handleHamburgerClick = (isOpen) => {
    setMobileMenuOpen(isOpen);
    if (!isOpen) {
      setActiveMenu(null); // Fecha o submenu quando fechar o menu principal
    }
  };

  return (
    <div>
      <HeaderPrincipal onHamburgerClick={handleHamburgerClick} />
      <NewMenuPrincipal
        location={location}
        toggleMenu={toggleMenu}
        isMenuActive={(menu) => activeMenu === menu}
        closeMenu={closeMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <NewMegaMenu
        activeMenu={activeMenu}
        closeMenu={closeMenu}
        location={location}
      />
    </div>
  );
};

export default NewHeader; 