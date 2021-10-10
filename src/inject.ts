(function () {
  const XHR = XMLHttpRequest.prototype;
  const { send } = XHR;
  const { open } = XHR;
  XHR.open = function (method, url) {
    this.url = url; // the request url
    return open.apply(this, arguments);
  };
  XHR.send = function () {
    this.addEventListener('load', function () {
      if (this.url.includes('https://m5.connective.com.au/api/mercury5/session/login')) {
        window.dispatchEvent(new CustomEvent('BrokerLabzMessage', {
          detail: {
            token: JSON.parse(this.response).token,
            partnerId: JSON.parse(this.response).partnerId,
          },
        }));
      }
    });
    return send.apply(this, arguments);
  };
}());
