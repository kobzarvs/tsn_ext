//
// Chrome Icon
//
var ChromeIcon = {
    context: null,
    settings: [],

    init: function() {
        this.create2dContext();
        return this;
    },

    create2dContext: function() {
        context = document.createElement('canvas').getContext('2d');
        context.width = 19;
        context.height = 19;
        context.textBaseline = 'middle';
        context.textAlign = 'center';
//        context.font = '14px Arial';
        context.font = '19px FontAwesome, regular';
        context.imageSmoothingEnabled = false;

        this.context = context;

        return context;
    },

    clear: function() {
        this.context.clearRect(0, 0, this.context.width, this.context.height);
    },

    text: function(text, color) {
        this.context.setFillColor(color);
        this.context.fillText(text, 19/2, 19/2);
    },

    show: function() {
        chrome.browserAction.setIcon({imageData: this.context.getImageData(0,0,19,19)});
    },

    fill: function(color) {
        this.context.setFillColor(color);
        this.context.fillRect(0, 0, this.context.width, this.context.height);
    }
}



//
//
// Chrom Tabs Utils
//
//

function requestToTab(tabId, cmd, cb) {
    chrome.tabs.sendRequest(
        tabId, cmd,
        function(data) {
            if (cb) cb(data);
        }
    );
}



function forTabsWithUrl(url, success, fail, skip) {
    chrome.tabs.query({windowType:'normal', status:'complete', }, function(tabs) {
        var successed = false;
        for (var i = 0; i < tabs.length; i++) {
            //console.log(tabs[i].url, url, tabs[i].url.contains(url));
            if (tabs[i].url.contains(url)) {
                //chrome.tabs.update(tabs[i].id, {active: true});
                if (success) success(tabs[i]);
                seccessed = true;
                if (skip) return;
            }
        }
        if (!successed && fail) fail();
        //chrome.tabs.create({ url: 'https://blistering-heat-2586.firebaseapp.com'});
    });
}




//
//
// Content Scripts Utils
//
//

function injectJS(url) {
  var s = document.createElement('script');

  s.src = chrome.extension.getURL(url);
  s.onload = function() {
      this.parentNode.removeChild(this);
  };
  (document.head||document.documentElement).appendChild(s);
}


function injectCustomStyle(str) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = str;
    document.getElementsByTagName('head')[0].appendChild(style);
}



//
//
// Local Storage Utils
//
//

function getValue(key) {
    val = localStorage[key];

    if (val)
        try {
            return JSON.parse(val);
        } catch (e) {

        }

    return val;
}
