import Cookies from './components/Cookies.js';

const privacyPolicy = {
  initCookies: () => {
    new Cookies('https://optad360.mgr.consensu.org/cmp/v2/vendor-list.json');
  },

  init: () => {
    privacyPolicy.initCookies();
  },
};

privacyPolicy.init();