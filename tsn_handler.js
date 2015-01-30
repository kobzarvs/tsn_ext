var logoContainer;

if (window.location.href.contains(TSNURL)) {
    console.log('Найдена вкладка сайта КВАРТИРНЫЙ ВОПРОС');
    console.log('Функционал сайта значииельно расширен ;)');

    logoContainer = $('img[src="http://tsn.spb.ru/img/appl_logo.png"]').parent();

    injectCustomStyle('.uploaded { background-color: lightblue !important; }');
    injectCustomStyle('.tsn_logo { margin: 20px 0px !important;}');
    
    chrome.extension.onRequest.addListener(onTsnExtensionMessage);

    init();
}

function isExtEnable() {
    return (getValue('TSN_STATUS')===true) ? true : false;
}


function trigger(e) {
    ifFireOnline(function() {
        if (e.target.name == 'checkall') {
            checkAllElements(e.target);
        } else {
            checkElement(e.target, e.target.checked);
        }
    });
}

function deinit() {
    //$('body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td:nth-child(1)').show();

    var logo = document.createElement('img');
    logo.width = 220;
    logo.border = 0;

    logo.src = "http://tsn.spb.ru/img/appl_logo.png";
    logo.className = "tsn_logo"

    logoContainer.html('');//remove();
    logoContainer.append(logo);

    $('.results > tbody > tr input').off('change', trigger);
    console.log('Расширение выключено');

    cb = getCheckBoxes();
    for(i in cb) {
        toggleCheckBoxRowStyle(cb[i], 'uploaded', false);
    }
}

function init() {
    if (!isExtEnable()) return;
    //$('body > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr > td:nth-child(1)').hide();

    ifFireOnline(function() {
        var logo = document.createElement('img');
        logo.width = 220;
        logo.border = 0;

        logo_plus_path = chrome.extension.getURL("appl_logo_plus.png");
        logo.src = logo_plus_path;
        logo.className = "tsn_logo"

        logoContainer.html('');//remove();
        logoContainer.append(logo);


        $('.results > tbody > tr input').on('change', trigger);
        console.log('Расширение включено');
    });
}




function parseRow(startElem) {

    var n = startElem.next();
    function nextElem() {
        n = n.next();
        return n;
    }

    

    fn = ['date','nk','address','metro','level','So','Sl','Sk',
        'tv','mebel','holod','stiral','cost','srok','who','phones','desc'];

    var converters = {
        nk: function(f, name) {
            f.nk = f.nk.match(/\d+/g);
        },

        metro: function (f, name) {
            mesto = f.metro.split(',');
            f.metro = {
                name: mesto[0].trim(),
                transport: (mesto[1]) ? mesto[1].trim() : ''
            };
        },

        date: function (f, name) {
            f.date = f[name].substring(0,8);
        },

        level: function (f, name) {
            levels = f.level.split('/');
            f.level = levels[0];
            f.levels = levels[1];
        },

        phones: function (f, name) {
            phones = f.phones.split(/\s+/);
            f.phones = [];
            for(i in phones) {
                f.phones[i] = phones[i].trim();
            }
            
        },

        desc: function (f, name) {
            desc = f.desc.replace(/Взято с портала tsnbase.ru \d*/,'');
            desc = desc.split(', ');
            f.desc = desc;
        }
    }

    f = {};
    for(i in fn) {
        f[fn[i]] = nextElem().text().trim();
    }

    for(i in fn) {
        fname = fn[i];
        if (converters[fname]) {
            converters[fname]( f, fname );
        }
    }

    // console.log(f);
    return f;
}


function checkElement(e, checked) {

    if (checked) {
        n = $('#'+e.id).parent();
        f = parseRow(n);

        chrome.extension.sendMessage('ajbehjoeddgfbhdfhjdmjkajjnamekag', {cmd: 'add', id: e.value, data: f});
        toggleCheckBoxRowStyle(e.id, 'uploaded', true);

    } else {
        chrome.extension.sendMessage('ajbehjoeddgfbhdfhjdmjkajjnamekag', {cmd: 'delete', id: e.value});
        toggleCheckBoxRowStyle(e.id, 'uploaded', false);
    }

    return e.value;
}


function getCheckBoxes() {
    data = {};
    c_boxes = $("#submitForm input[name='selectedID[]']");
    c_boxes.each(function(i,v){ data[v.value] = v.id } );
    return data;
}

function checkAllElements(e) {
  try {
    c_boxes = $("#submitForm input[name='selectedID[]']");
    c_boxes.each(function(i,el) {
      checkElement(el, e.checked);
    });
  } catch(e) {
    console.log("Error: ", e);
  }
}


function toggleCheckBoxRowStyle(id, style, flag) {
    first = $('#'+id).parent();
    row = first.nextAll();
    row.push(first);
    row.map(function(idx, td) {
        $(td).toggleClass(style, flag);
    });
}


function onTsnExtensionMessage(request, ext, resp) {
    // console.log('REQUEST to TSN: ', request);

    if (request['cmd']==undefined)
        return;

    if (request.cmd == 'status') {
        localStorage['TSN_STATUS'] = request.status;
        if (isExtEnable()) {
            init();
            resp();
        } else {
            deinit();
            resp();
        }
    }

    if (!isExtEnable()) return;

    switch(request['cmd']) {
        case 'getCheckBoxes':
            // console.log('send check boxes');
            cb = getCheckBoxes();
            resp({checkBoxes: cb});
            break;

        case 'setCheckBoxes':
            if (request && request.data) {
                cbl = request.data;

                for(i in cbl) {
                    toggleCheckBoxRowStyle(cbl[i], 'uploaded', true);
                }
            }

            break;
    }
}
