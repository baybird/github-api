export function httpGet(url) {
  return new Promise(function(resolve, reject) {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.onload = function() {

      if (req.status === 200) {
        resolve(req.responseText);
      }else if (req.status === 409) {
        resolve("[]");
      }else {
        reject(Error(req.status + "\n" + req.responseText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    req.send();
  });
}
