export const disableScroll = (fix) => {
  let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
  document.body.style.paddingRight = paddingOffset;
  fix.forEach((el) => {
    el.style.paddingRight = paddingOffset;
  });
	let pagePosition = window.scrollY;
	document.body.classList.add('disable-scroll');
	document.body.dataset.position = pagePosition;
	document.body.style.top = -pagePosition + 'px';
}

export const enableScroll = (fix) => {
	let pagePosition = parseInt(document.body.dataset.position, 10);
	document.body.style.top = 'auto';
  document.body.classList.remove('disable-scroll');
  fix.forEach((el) => {
    el.style.paddingRight = '0px';
  });
  body.style.paddingRight = '0px';
	window.scroll({top: pagePosition, left: 0});
	document.body.removeAttribute('data-position');
}
