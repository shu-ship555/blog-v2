import Swiper from "swiper/bundle";

/**
 * ハンバーガーメニューの設定
 */
const setupHamburgerMenu = () => {
  const openButton = document.querySelector('.js-open');
  const closeButton = document.querySelector('.js-close');
  const menuElement = document.querySelector('.js-menu');
  const backgroundElement = document.querySelector('.js-bg');

  if (!openButton || !closeButton || !menuElement || !backgroundElement) return;

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

/**
 * 画像モーダルの設定
 */
const setupImageModal = () => {
  const expandItems = document.querySelectorAll('.js-expand-modal');
  if (!expandItems.length) return;

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
    if (e.key === 'Escape') closeModal();
  };

  expandItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const button = e.target instanceof Element ? e.target.closest('.expand-btn') : null;
      if (!button || isModalOpen) return;

      const listItem = button.closest('li');
      if (!listItem) return;

      let img = listItem.querySelector('.swiper-slide-active img') || listItem.querySelector('.expand-img img');
      if (!img) return;

      const parentExpandImg = img.closest('.expand-img');
      let inlineStyle = parentExpandImg ? (parentExpandImg.getAttribute('style') || '').replace(/(^|;|\s)width\s*:\s*[^;]+;?\s*/gi, '$1') : '';

      const imgSrc = img.getAttribute('src');
      const imgAlt = img.getAttribute('alt');

      const isLarge = item.classList.contains('js-em-l');

      modalContainer.innerHTML = isLarge ? `
        <div id="image-modal-overlay" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000]/[0.48] backdrop-blur-md">
          <div class="rounded sm:rounded-none max-w-[64vw] sm:max-w-full relative px-[48px] pt-[48px] pb-[56px] sm:px-[28px] sm:pt-[28px] sm:pb-[32px] bg-white shadow-lg" tabindex="-1">
            <div class="w-full object-contain" style="${inlineStyle}">
              <img src="${imgSrc}" alt="${imgAlt}" class="w-full object-contain" />
            </div>
            <button id="close-modal-btn" class="absolute bottom-[24px] sm:bottom-[12px] left-1/2 -translate-x-1/2 leading-none bg-[#FFF] rounded-md text-[12px] sm:text-[10px] font-bold text-[#0079C9] opacity-hover duration">閉じる &times;</button>
          </div>
        </div>
      ` : `
        <div id="image-modal-overlay" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000]/[0.48] backdrop-blur-md">
          <div class="relative rounded p-[48px] sm:p-[24px] bg-white bg-[url('/img/focusRectangle.svg')] bg-center bg-contain" tabindex="-1">
            <div class="w-[240px] sm:w-[120px]" style="${inlineStyle}">
              <img src="${imgSrc}" alt="${imgAlt}" class="max-w-full object-contain" />
            </div>
          </div>
          <button id="close-modal-btn" class="mt-[32px] px-[16px] sm:px-[12px] pt-[8px] sm:pt-[6px] pb-[10px] sm:pb-[8px] rounded-sm leading-none bg-[#FFF] text-[12px] sm:text-[10px] font-bold text-[#0079C9] opacity-hover duration">
            <span class="inline-flex items-center gap-[8px] sm:gap-[4px]">閉じる <span class="text-[20px] sm:text-[16px]">&times;</span></span>
          </button>
        </div>
      `;

      document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
      document.getElementById('image-modal-overlay')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
      });

      document.addEventListener('keydown', handleEscape);
      isModalOpen = true;
      document.body.classList.add('modal-open');
    });
  });
};

/**
 * スクロールインジケーターの設定
 */
const setupScrollIndicator = () => {
  const container = document.getElementById('scrollContainer');
  const indicator = document.getElementById('scrollIndicator');
  if (!container || !indicator) return;

  const check = () => {
    container.scrollHeight > container.clientHeight ? indicator.classList.add('is-scrollable') : indicator.classList.remove('is-scrollable');
  };

  new ResizeObserver(check).observe(container);
  container.addEventListener('scroll', () => {
    if (container.scrollTop > 0) indicator.classList.remove('is-scrollable');
  });
  check();
};

/**
 * フィルタードロップダウンの設定
 */
const setupFilter = () => {
  document.querySelectorAll('.js-filter').forEach((container) => {
    const btn = container.querySelector('.js-filter-btn');
    const menu = container.querySelector('.js-filter-menu');
    const icon = container.querySelector('.js-filter-icon');

    if (!btn || !menu || !icon) return;

    const toggle = (e) => {
      const isOpen = menu.classList.toggle('flex');
      menu.classList.toggle('hidden', !isOpen);
      icon.classList.toggle('rotate-90', isOpen);

      if (isOpen) {
        setTimeout(() => document.addEventListener('click', outsideClick), 0);
      } else {
        document.removeEventListener('click', outsideClick);
      }
      e.stopPropagation();
    };

    const outsideClick = (e) => {
      if (!container.contains(e.target)) {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        icon.classList.remove('rotate-90');
        document.removeEventListener('click', outsideClick);
      }
    };

    btn.addEventListener('click', toggle);
  });
};

const setupSwiper = () => {
  const swiperElements = document.querySelectorAll('.swiper[id^="swiper-"], .note-swiper');

  swiperElements.forEach(el => {
    const isNote = el.classList.contains('note-swiper');

    new Swiper(el, {
      loop: true,
			autoplay: true,
      pagination: {
        el: el.querySelector(".swiper-pagination"),
        clickable: true,
      },
      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev"),
      },
			...(isNote ? {
					slidesPerView: 1,
					spaceBetween: 24,
					breakpoints: {
						1417: { slidesPerView: 6 },
					},
				} : {
					slidesPerView: 1,
					spaceBetween: 0,
				}),
			});
  });
};

document.addEventListener('DOMContentLoaded', () => {
  setupHamburgerMenu();
  setupImageModal();
  setupScrollIndicator();
  setupFilter();
  setupSwiper();
});
