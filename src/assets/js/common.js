const setupHamburgerMenu = () => {
	const openButton = document.querySelector('.js-open');
	const closeButton = document.querySelector('.js-close');
	const menuElement = document.querySelector('.js-menu');
	const backgroundElement = document.querySelector('.js-bg');

	if (!openButton || !closeButton || !menuElement || !backgroundElement) {
		console.warn('Hamburger menu elements not found.');
		return;
	}

	let scrollPosition = 0;

	const openMenu = () => {
		scrollPosition = window.scrollY;
		document.body.classList.add('is-active');
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const closeMenu = () => {
		document.body.classList.remove('is-active');
		window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
	};

	openButton.addEventListener('click', openMenu);
	closeButton.addEventListener('click', closeMenu);
	backgroundElement.addEventListener('click', closeMenu);
};

const setupImageModal = () => {
	const modalContainer = document.createElement('div');
	document.body.appendChild(modalContainer);

	let isModalOpen = false;

	const closeModal = () => {
		modalContainer.innerHTML = '';
		isModalOpen = false;
		document.removeEventListener('keydown', handleEscape);
		document.body.classList.remove('modal-open');
	};

	const handleEscape = (e) => {
		if (e.key === 'Escape') {
			closeModal();
		}
	};

	const expandItems = document.querySelectorAll('.js-expand-modal');
	if (!expandItems.length) return;

	expandItems.forEach((item) => {
		item.addEventListener('click', (e) => {
			if (e.target instanceof Element) {
				const button = e.target.closest('.expand-btn');
				if (button && !isModalOpen) {
					const listItem = button.closest('li');
					if (listItem) {
						const img = listItem.querySelector('img');
						if (img) {
							const imgSrc = img.getAttribute('src');
							const imgAlt = img.getAttribute('alt');

							if (item.classList.contains('js-em-l')) {
								modalContainer.innerHTML = `
								<div id="image-modal-overlay" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000]/[0.48] backdrop-blur-md">
									<div class="relative p-[64px] sm:p-[32px] bg-white rounded-lg sm:rounded-none shadow-lg" tabindex="-1">
										<img src="${imgSrc}" alt="${imgAlt}" class="w-full object-contain max-w-[960px]" />
									</div>
									<button id="close-modal-btn" class="mt-[32px] px-[28px] sm:px-[20px] pt-[16px] sm:pt-[12px] pb-[18px] sm:pb-[14px] leading-none bg-[#FFF] rounded-md text-[14px] sm:text-[12px] font-bold text-[#0079C9] opacity-hover duration">
										閉じる &times;
									</button>
								</div>
							`;
							} else {
								modalContainer.innerHTML = `
								<div id="image-modal-overlay" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000]/[0.48] backdrop-blur-md">
									<div class="relative p-[48px] sm:p-[24px] bg-white bg-[url('/img/focusRectangle.svg')] bg-center bg-contain rounded-lg shadow-lg" tabindex="-1">
										<div class="w-[240px] sm:w-[120px]">
											<img src="${imgSrc}" alt="${imgAlt}" class="max-w-full object-contain" />
										</div>
									</div>
									<button id="close-modal-btn" class="mt-[32px] px-[24px] sm:px-[16px] pt-[12px] sm:pt-[10px] pb-[14px] sm:pb-[12px] leading-none bg-[#FFF] rounded-md text-[12px] sm:text-[10px] font-bold text-[#0079C9] opacity-hover duration">
										<span class="inline-flex items-center gap-[8px] sm:gap-[4px]">
											閉じる <span class="text-[20px] sm:text-[16px]">&times;</span>
										</span>
									</button>
								</div>
							`;
							}

							const closeModalBtn = document.getElementById('close-modal-btn');
							const modalOverlay = document.getElementById('image-modal-overlay');

							if (closeModalBtn) {
								closeModalBtn.addEventListener('click', closeModal);
							}
							if (modalOverlay) {
								modalOverlay.addEventListener('click', (e) => {
									if (e.target === modalOverlay) {
										closeModal();
									}
								});
							}
							document.addEventListener('keydown', handleEscape);
							isModalOpen = true;
							document.body.classList.add('modal-open');
						}
					}
				}
			}
		});
	});
};

const setupScrollIndicator = () => {
	const tocContainer = document.getElementById('scrollContainer');
	const scrollIndicator = document.getElementById('scrollIndicator');

	if (!tocContainer || !scrollIndicator) {
		console.warn('Scroll indicator elements not found.');
		return;
	}

	const checkScrollability = () => {
		const isScrollable = tocContainer.scrollHeight > tocContainer.clientHeight;
		if (isScrollable) {
			scrollIndicator.classList.add('is-scrollable');
		} else {
			scrollIndicator.classList.remove('is-scrollable');
		}
	};

	const resizeObserver = new ResizeObserver(() => {
		checkScrollability();
	});
	resizeObserver.observe(tocContainer);

	tocContainer.addEventListener('scroll', () => {
		if (tocContainer.scrollTop > 0) {
			scrollIndicator.classList.remove('is-scrollable');
		}
	});
	checkScrollability();
};

const setupFilter = () => {
	const filterContainers = document.querySelectorAll('.js-filter');

	if (filterContainers.length === 0) {
		console.warn('Filter containers not found.');
		return;
	}

	filterContainers.forEach((container) => {
		const toggleButton = container.querySelector('.js-filter-btn');
		const dropdownList = container.querySelector('.js-filter-menu');
		const icon = container.querySelector('.js-filter-icon');

		if (toggleButton && dropdownList && icon) {
			const closeFilter = () => {
				dropdownList.classList.add('hidden');
				dropdownList.classList.remove('flex');
				icon.classList.remove('rotate-90');
				document.removeEventListener('click', handleOutsideClick);
			};
			const handleOutsideClick = (event) => {
				if (!container.contains(event.target)) {
					closeFilter();
				}
			};

			toggleButton.addEventListener('click', (event) => {

				dropdownList.classList.toggle('flex');
				dropdownList.classList.toggle('hidden');
				icon.classList.toggle('rotate-90');

				if (dropdownList.classList.contains('flex')) {
					setTimeout(() => {
						document.addEventListener('click', handleOutsideClick);
					}, 0);
				} else {
					document.removeEventListener('click', handleOutsideClick);
				}
				event.stopPropagation();
			});
		} else {
			console.warn('Missing elements within a .js-filter container.', container);
		}
	});
};

document.addEventListener('DOMContentLoaded', () => {
	setupHamburgerMenu();
	setupImageModal();
	setupScrollIndicator();
	setupFilter();
});
