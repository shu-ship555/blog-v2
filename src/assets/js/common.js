document.addEventListener('DOMContentLoaded', () => {
	const openButton = document.querySelector('.js-open');
	const closeButton = document.querySelector('.js-close');
	const menuElement = document.querySelector('.js-menu');
	const backgroundElement = document.querySelector('.js-bg');
	const buttonElement = document.querySelector('.buttonSp');

if (buttonElement) {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        buttonElement.classList.add('block');
        buttonElement.classList.remove('hidden');
      } else {
        buttonElement.classList.add('hidden');
        buttonElement.classList.remove('block');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
  }

	let scrollPosition = 0;

	if (openButton && closeButton && menuElement && backgroundElement) {
		const openMenu = () => {
			scrollPosition = window.scrollY;
			document.body.classList.add('is-active');
			buttonElement.classList.add('hidden');
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		};

		const closeMenu = () => {
			document.body.classList.remove('is-active');
			buttonElement.classList.remove('block');
			window.scrollTo({
				top: scrollPosition,
				behavior: 'smooth'
			});
		};


		openButton.addEventListener('click', openMenu);
		closeButton.addEventListener('click', closeMenu);
		backgroundElement.addEventListener('click', closeMenu);
	}
});
