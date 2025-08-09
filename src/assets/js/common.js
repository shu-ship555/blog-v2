document.addEventListener('DOMContentLoaded', () => {
  const openButton = document.querySelector('.js-open');
  const closeButton = document.querySelector('.js-close');
  const menuElement = document.querySelector('.js-menu');
  const backgroundElement = document.querySelector('.js-bg');

  let scrollPosition = 0;

  if (openButton && closeButton && menuElement && backgroundElement) {
    const openMenu = () => {
      scrollPosition = window.scrollY;
      document.body.classList.add('is-active');
      window.scrollTo(0, 0);
    };

    const closeMenu = () => {
      document.body.classList.remove('is-active');
      window.scrollTo(0, scrollPosition);
    };

    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);
    backgroundElement.addEventListener('click', closeMenu);
  }
});
