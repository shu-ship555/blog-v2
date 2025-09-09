document.addEventListener('DOMContentLoaded', () => {
  // ハンバーガーメニューの開閉機能
  const openButton = document.querySelector('.js-open');
  const closeButton = document.querySelector('.js-close');
  const menuElement = document.querySelector('.js-menu');
  const backgroundElement = document.querySelector('.js-bg');

  let scrollPosition = 0;

  if (openButton && closeButton && menuElement && backgroundElement) {
    const openMenu = () => {
      scrollPosition = window.scrollY;
      document.body.classList.add('is-active');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    const closeMenu = () => {
      document.body.classList.remove('is-active');
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    };

    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);
    backgroundElement.addEventListener('click', closeMenu);
  }



  // --- 画像拡大モーダルの開閉機能 ---
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

  const iconList = document.querySelector('.icon-list');
  if (iconList) {
    iconList.addEventListener('click', (e) => {
			console.log(e.target);
      if (e.target instanceof Element) {
        const button = e.target.closest('.expand-btn');
        if (button && !isModalOpen) {
          const listItem = button.closest('li');
          if (listItem) {
            const img = listItem.querySelector('img');
            if (img) {
              const imgSrc = img.getAttribute('src');
              const imgAlt = img.getAttribute('alt');

              modalContainer.innerHTML = `
                <div id="image-modal-overlay" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000]/[0.48] backdrop-blur-md">
                  <div class="relative p-[48px] sm:p-[24px] bg-white bg-[url('/img/focusRectangle.svg')] bg-center bg-contain rounded-lg shadow-lg" tabindex="-1">
										<div class="w-[240px] sm:w-[120px]"><img src="${imgSrc}" alt="${imgAlt}" class="max-w-full object-contain" /></div>
                  </div>
									<button id="close-modal-btn" class="mt-[32px] px-[24px] sm:px-[16px] pt-[12px] sm:pt-[10px] pb-[14px] sm:pb-[12px] leading-none bg-[#FFF] rounded-md text-[12px] sm:text-[10px] font-bold text-[#0079C9] top-[6px] sm:top-[2px] right-[12px] sm:right-[6px] opacity-hover duration">
										<span class="inline-flex items-center gap-[8px] sm:gap-[4px]">閉じる <span class="text-[20px] sm:text-[16px]">&times;</span></span>
									</button>
                </div>
              `;

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
  }

	// --- 目次スクロールインジケーター ---
	const tocContainer = document.getElementById('scrollContainer');
	const scrollIndicator = document.getElementById('scrollIndicator');

	if (!tocContainer || !scrollIndicator) {
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
		// 一度でもスクロールしたら即消す
		if (tocContainer.scrollTop > 0) {
			scrollIndicator.classList.remove('is-scrollable');
		}
	});

	// 初期ロード時にスクロール可能かチェック
	checkScrollability();
});
