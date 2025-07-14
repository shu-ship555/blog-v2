
  document.addEventListener('DOMContentLoaded', () => {
    const jsMenu = document.querySelector('.js-menu');
    const jsOpen = document.querySelector('.js-open');
    const jsClose = document.querySelector('.js-close');

    if (jsMenu && jsOpen && jsClose) {
      jsOpen.addEventListener('click', () => {
        jsMenu.classList.remove('sm:hidden');
        jsMenu.classList.add('sm:flex');
        jsOpen.classList.add('sm:hidden');
        jsClose.classList.remove('hidden');
      });

      jsClose.addEventListener('click', () => {
        jsMenu.classList.add('sm:hidden');
        jsMenu.classList.remove('sm:flex');
        jsOpen.classList.remove('sm:hidden');
        jsClose.classList.add('hidden');
      });
    }
  });
