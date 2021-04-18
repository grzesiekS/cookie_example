class Cookies {
  constructor() {
    this.vendorUrl = 'https://optad360.mgr.consensu.org/cmp/v2/vendor-list.json';

    this.getElements();
    this.getVendorsData(this.vendorUrl);
    this.setBlurClassToElements();
    this.setStopScrolling();
  }

  getVendorsData(url) {
    const thisCookies = this;
    Promise.all(
      [fetch(url)]
    )
      .then(function(allResponse) {
        const vendorsResponse = allResponse[0];
        return Promise.all([
          vendorsResponse.json(),
        ]);
      })
      .then(function([vendors]) {
        thisCookies.setVendorsData(vendors.vendors);
      });
  }

  setVendorsData(data) {
    const dataReturned = [];
    for(let vendor in data) {
      dataReturned.push(data[vendor]);
    }
    
    this.vendorsData = dataReturned;
  }

  setBlurClassToElements() {
    const thisCookies = this;

    for(let element of thisCookies.selectAll) {
      const attClass = element.getAttribute('class');
      if(attClass !== null && !attClass.includes('popUp')) {
        element.classList.add('blur');
      }
    }
  }

  setStopScrolling() {
    window.addEventListener('scroll', () => {window.scrollTo(0, 0);});
  }

  getElements() {
    const thisCookies = this;

    thisCookies.selectAll = document.body.querySelectorAll('*');
  }
}

export default Cookies;