export const resizeContent = (selector, mobileWidth = 576, isPlugin, desktopAction = null, mobileAction = null) => {
	if (!isPlugin) {
		// actions with selector
		if (window.innerWidth > mobileWidth) {
			desktopAction();
		} else {
			mobileAction();
		}
	} else {
		if ((window.innerWidth <= mobileWidth) && selector.dataset.pluginActivated == 'false') {
			mobileAction();
			selector.dataset.pluginActivated = 'true';
		}

		if (window.innerWidth > mobileWidth) {
			desktopAction();
			selector.dataset.pluginActivated = 'false';
		}
	}
}

// plugin selector must have data-plugin-activated attribute

/*
const slider = document.querySelector('.swiper-container');

let mySwiper;

function sliderMobile() {
	mySwiper = new Swiper(slider, {
		speed: 400,
		spaceBetween: 100
	});
}

function disableSlider() {
	if (slider.classList.contains('swiper-container-initialized')) {
		mySwiper.destroy();
	}
}

resizeContent(slider, 768, true, disableSlider, sliderMobile);

window.addEventListener('resize', () => {
	resizeContent(slider, 768, true, disableSlider, sliderMobile);
});

*/
