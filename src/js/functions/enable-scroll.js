export const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll('.fixed-block');
  const body = document.body;
  const pagePosition = parseInt(body.dataset.position, 10);
  fixBlocks.forEach(el => { el.style.paddingRight = '0px'; });
  body.style.paddingRight = '0px';

  body.style.top = 'auto';
  body.classList.remove('dis-scroll');
  window.scroll({
    top: pagePosition,
    left: 0
  });
  body.removeAttribute('data-position');
  body.style.scrollBehavior = 'smooth';
}
