import vars from '../_vars';

export const disableScroll = () => {
  const fixBlocks = document?.querySelectorAll('.fixed-block');
  const pagePosition = window.scrollY;
  const paddingOffset = `${(window.innerWidth - vars.bodyEl.offsetWidth)}px`;

  vars.htmlEl.style.scrollBehavior = 'none';
  fixBlocks.forEach(el => { el.style.paddingRight = paddingOffset; });
  vars.bodyEl.style.paddingRight = paddingOffset;
  vars.bodyEl.classList.add('dis-scroll');
  vars.bodyEl.dataset.position = pagePosition;
  vars.bodyEl.style.top = `-${pagePosition}px`;
}
