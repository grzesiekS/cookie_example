import Cookies from './components/Cookies.js';

const privacyPolicy = {
  initCookies: () => {
    new Cookies();
  },

  init: () => {
    privacyPolicy.initCookies();
  },
};

privacyPolicy.init();