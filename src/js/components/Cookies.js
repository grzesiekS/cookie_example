class Cookies {
  constructor() {
    this.vendorUrl = 'https://optad360.mgr.consensu.org/cmp/v2/vendor-list.json';
    this.vendorsCookieAccept = [];
    this.cookieAccept = false;
    this.scrollZero = () => window.scrollTo(0, 0);

    this.getCookiAcceptData();

    if(!this.cookieAccept) {
      this.createPopUpHtml();

      this.getElements();
      this.getVendorsData(this.vendorUrl);
      this.setBlurClassToElements();
      this.setStopScrolling();

      this.handleAcceptAction();
    }
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
    

    this.renderVendorInDOM(dataReturned);
  }

  renderVendorInDOM(vendorsData) {
    const thisCookies = this;

    for(let vendor of vendorsData) {
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
    vendorAcceptButton.setAttribute('vendorid', vendorData.id);

    if(thisCookies.vendorsCookieAccept.indexOf(vendorData.id.toString()) !== -1) {
      vendorAcceptButton.classList.add('accept');
    }

    vendorAcceptButton.addEventListener('click', function() {
      const vendorId = this.getAttribute('vendorid');

      if(thisCookies.vendorsCookieAccept.indexOf(vendorId) === -1) {
        thisCookies.vendorsCookieAccept.push(vendorId);
        this.classList.add('accept');
      }
      
    });

    vendorElement.appendChild(vendorAcceptButton);

    thisCookies.appendVendorElementToList(vendorElement);
  }

  appendVendorElementToList(vendorElement) {
    const thisCookies = this;

    thisCookies.popUpVendors.appendChild(vendorElement);
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
    const thisCookies = this;

    window.addEventListener('scroll', thisCookies.scrollZero, true);
  }

  unlockScrolling() {
    const thisCookies = this;

    window.removeEventListener('scroll', thisCookies.scrollZero, true);
  }

  handleAcceptAction() {
    const thisCookies = this;

    thisCookies.acceptCookiesButton.addEventListener('click', () => {
      thisCookies.acceptCookieCreate();
      thisCookies.removePopUp();
      thisCookies.removeBlurClass();
      thisCookies.unlockScrolling();
    });
  }

  acceptCookieCreate() {
    const thisCookies = this;
    document.cookie = `cookiePrivacyPolice=${JSON.stringify({accept: true, vendorsAccept: thisCookies.vendorsCookieAccept})}`;
  }

  getCookiAcceptData() {
    const thisCookies = this;

    const privacyPolice = document.cookie.split(';')
      .filter(data => data.includes('cookiePrivacyPolice='))[0];

    if(privacyPolice) {
      const privacyPoliceData = JSON.parse(privacyPolice.replace('cookiePrivacyPolice=', ''));

      thisCookies.cookieAccept = privacyPoliceData.accept;
      thisCookies.vendorsCookieAccept = privacyPoliceData.vendorsAccept;
    }
  
  }

  removePopUp() {
    const thisCookies = this;

    thisCookies.popUp.remove();
  }

  removeBlurClass() {
    const thisCookies = this;

    for(let element of thisCookies.selectAll) {
      element.classList.remove('blur');
    }
  }

  getElements() {
    const thisCookies = this;

    thisCookies.selectAll = document.body.children;
    thisCookies.popUpVendors = document.querySelector('.popUp__vendorsList');
    thisCookies.acceptCookiesButton = document.querySelector('.popUp__buttons--confirm .button--accept');
    thisCookies.popUp = document.querySelector('.popUp');
  }
}

export default Cookies;