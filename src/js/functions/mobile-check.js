import vars from '../_vars.js';

export const mobileCheck = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    vars.htmlEl.classList.add('page--android');
    return "Android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    vars.htmlEl.classList.add('page--ios');
    return "iOS";
  }

  return "unknown";
};
