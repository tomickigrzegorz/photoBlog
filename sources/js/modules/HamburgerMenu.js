const HamburgerMenu = () => {
  const overLayMenu = document.querySelector('#toggle-nav');

  overLayMenu.addEventListener('click', () => {
    document.body.classList.toggle('hide-overflow');

    return false;
  });
};

export default HamburgerMenu;
