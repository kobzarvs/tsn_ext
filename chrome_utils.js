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


function replaceImage(img, path) {
    newImage = chrome.extension.getURL(path);
    img.attr('src', newImage);
}


var ToggleImage = {
    src: {},
    index: 0,
    img: null,
    size: 0,

    init: function(args) {
        img = args[1];
        this.img = img;
        idx = 0;

        if (args) {
            for(i in args) {
                src = null;

                if (args[i].src) {
                    src = args[i].src;
                } else if (args[i].ext) {
                    src = chrome.extension.getURL(args[i].ext);
                }

                if (src) {
                    this.src[idx] = src;
                    idx++;
                 
                    if (args[i].tag) this.src[args[i].tag] = src;
                }
            }
        }
        this.size = idx;
        this.index = 0;
    },

    cycle: function() {
        this.index = (this.index + 1) % this.size;
        this.show(this.index);
    },

    show: function(index) {
        console.log('index: ', this.index);
        this.img.attr('src', this.src[this.index]);
    },

    tag: function(tag) {
        this.img.attr('src', this.src[tag]);
    }
}



//
// 1. Находит элементы соотвествующие cssPath
// 2. Добавляет рядом с ними новые элементы с ID = prefix + id найденного элемента
// 3. добавляет обработчики событий к новым элементам
// 4. Скрывает новые элементы
//
function addIndexedDiv(cssPath, prefix, content, className, events, callback) {
    cbList = $(cssPath);
    _.forEach(cbList, function(value, key) {
        cb = $(value);
        newBtn = document.createElement('div');
        $(newBtn).toggleClass(className, true);
        $(newBtn).attr('id', prefix + value.value);
        $(newBtn).html(content);
        $(newBtn).hide();

        cb.parent().append(newBtn);

        $(newBtn).on(events, callback);
    });
}


function toggleRowStyle(id, style, flag) {
    first = $('#'+id).parent();

    first.prevAll().map(function(idx, td) {
        $(td).toggleClass(style, flag);
    });

    $(first).toggleClass(style, flag);

    first.nextAll().map(function(idx, td) {
        $(td).toggleClass(style, flag);
    });
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



