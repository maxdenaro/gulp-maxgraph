(function(){
  const burger = document?.querySelector('[data-burger]');
  const menu = document?.querySelector('[data-menu]');
  const menuItems = document?.querySelectorAll('[data-menu-item]');

  burger?.addEventListener('click', (e) => {
    burger.classList.toggle('burger--active');
    menu.classList.toggle('menu--active');

    if (!menu.classList.contains('menu--active')) {
      enableScroll();
    } else {
      disableScroll();
    }
  });

  menuItems?.forEach(el => {
    el.addEventListener('click', () => {
      burger.classList.remove('burger--active');
      menu.classList.remove('menu--active');
      enableScroll();
    });
  });
})();
