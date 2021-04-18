class Cookies {
  constructor() {
    this.vendorUrl = 'https://optad360.mgr.consensu.org/cmp/v2/vendor-list.json';

    this.getVendorsData(this.vendorUrl);
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
}

export default Cookies;