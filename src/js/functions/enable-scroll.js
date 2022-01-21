import vars from '../_vars';

export const enableScroll = () => {
  const fixBlocks = document?.querySelectorAll('.fixed-block');
  const body = document.body;
  const pagePosition = parseInt(vars.bodyEl.dataset.position, 10);
  fixBlocks.forEach(el => { el.style.paddingRight = '0px'; });
  vars.bodyEl.style.paddingRight = '0px';

  vars.bodyEl.style.top = 'auto';
  vars.bodyEl.classList.remove('dis-scroll');
  window.scroll({
    top: pagePosition,
    left: 0
  });
  vars.bodyEl.removeAttribute('data-position');
  vars.htmlEl.style.scrollBehavior = 'smooth';
}
