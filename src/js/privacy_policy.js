const privacyPolicy = {
  initVendors: () => {
    console.log('vendors');
  },

  init: () => {
    privacyPolicy.initVendors();
  },
};

privacyPolicy.init();