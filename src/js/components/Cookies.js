class Cookies {
  constructor() {
    this.vendorUrl = 'https://optad360.mgr.consensu.org/cmp/v2/vendor-list.json';
    this.vendorsOnPage = 4;
    this.currentPage = 0;
    this.maxPages = 1;

    this.createPopUpHtml();

    this.getElements();
    this.getVendorsData(this.vendorUrl);
    this.setBlurClassToElements();
    this.setStopScrolling();

    this.handleNextVendors();
  }

  createPopUpHtml() {
    const popUpSection = document.createElement('section');
    popUpSection.classList.add('popUp');

    const popUpTitle = document.createElement('h1');
    popUpTitle.classList.add('popUp__title');
    popUpTitle.innerHTML = 'GDPR consent';

    popUpSection.appendChild(popUpTitle);

    const popUpVendorSection = document.createElement('div');
    popUpVendorSection.classList.add('popUp__vendorsList');

    popUpSection.appendChild(popUpVendorSection);

    const popUpNavButtons = document.createElement('div');
    popUpNavButtons.classList.add('popUp__buttons');

    const leftButton = document.createElement('button');
    leftButton.classList.add('button');
    leftButton.classList.add('button--prev');

    leftButton.innerHTML = 'Prev';

    const rightButton = document.createElement('button');
    rightButton.classList.add('button');
    rightButton.classList.add('button--next');

    rightButton.innerHTML = 'Next';

    popUpNavButtons.appendChild(leftButton);
    popUpNavButtons.appendChild(rightButton);

    popUpSection.appendChild(popUpNavButtons);

    const popUpButtons = document.createElement('div');
    popUpButtons.classList.add('popUp__buttons');
    popUpButtons.classList.add('popUp__buttons--confirm');

    const buttonAccept = document.createElement('button');
    buttonAccept.classList.add('button');
    buttonAccept.classList.add('button--accept');
    buttonAccept.innerHTML = 'Accept';

    const buttonReject = document.createElement('button');
    buttonReject.classList.add('button');
    buttonReject.classList.add('button--reject');
    buttonReject.innerHTML = 'Reject';

    popUpButtons.appendChild(buttonAccept);
    popUpButtons.appendChild(buttonReject);

    popUpSection.appendChild(popUpButtons);

    document.body.prepend(popUpSection);
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
    
    this.maxPages = Math.ceil(dataReturned.length / this.vendorsOnPage);

    this.renderVendorInDOM(dataReturned);
  }

  renderVendorInDOM(vendorsData) {
    const thisCookies = this;

    const vendorsToRender = vendorsData.slice(
      thisCookies.currentPage * thisCookies.vendorsOnPage,
      thisCookies.vendorsOnPage * (thisCookies.currentPage + 1)
    );

    for(let vendor of vendorsToRender) {
      thisCookies.createVendorElement(vendor);
    }
  }

  createVendorElement(vendorData) {
    const thisCookies = this;

    const vendorElement = document.createElement('div');
    vendorElement.classList.add('popUp__vendor');

    const vendorNameElement = document.createElement('h2');
    vendorNameElement.classList.add('popUp__vendor-name');
    vendorNameElement.innerHTML = vendorData.name;

    vendorElement.appendChild(vendorNameElement);

    const vendorPolicyUrlElement = document.createElement('a');
    vendorPolicyUrlElement.setAttribute('href', vendorData.policyUrl);
    vendorPolicyUrlElement.innerHTML = 'Policy URL';

    vendorElement.appendChild(vendorPolicyUrlElement);

    const vendorAcceptButton = document.createElement('button');
    vendorAcceptButton.classList.add('button');
    vendorAcceptButton.classList.add('button--accept');
    vendorAcceptButton.innerHTML = 'Accept';

    vendorElement.appendChild(vendorAcceptButton);

    thisCookies.appendVendorElementToList(vendorElement);
  }

  appendVendorElementToList(vendorElement) {
    const thisCookies = this;

    thisCookies.popUp.appendChild(vendorElement);
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

  handleNextVendors() {
    const thisCookies = this;

    thisCookies.nextButton.addEventListener('click', () => {
      if(thisCookies.currentPage < thisCookies.maxPages) {
        thisCookies.currentPage += 1;
        thisCookies.popUp.innerHTML = '';
        thisCookies.getVendorsData(thisCookies.vendorUrl);
      }
    });
  }

  getElements() {
    const thisCookies = this;

    thisCookies.selectAll = document.body.children;
    thisCookies.popUp = document.querySelector('.popUp__vendorsList');
    thisCookies.nextButton = document.querySelector('.button--next');
    thisCookies.prevButton = document.querySelector('.button--prev');
  }
}

export default Cookies;