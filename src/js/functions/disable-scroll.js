export const disableScroll = () => {
  const fixBlocks = document?.querySelectorAll('.fixed-block');
  const body = document.body;
  const pagePosition = window.scrollY;
  const paddingOffset = `${(window.innerWidth - body.offsetWidth)}px`;

  body.style.scrollBehavior = 'auto';
  fixBlocks.forEach(el => { el.style.paddingRight = paddingOffset; });
  body.style.paddingRight = paddingOffset;
  body.classList.add('dis-scroll');
  body.dataset.position = pagePosition;
  body.style.top = `-${pagePosition}px`;
}
