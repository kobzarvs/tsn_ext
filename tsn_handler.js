var logoContainer, tim;


if (window.location.href.contains(TSNURL)) {
    console.log('Найдена вкладка сайта КВАРТИРНЫЙ ВОПРОС');
    console.log('Функционал сайта значииельно расширен ;)');

    tim = newClass(ToggleImage,
        $('img[src="http://tsn.spb.ru/img/appl_logo.png"]'),
        {tag: 'offline', src: 'http://tsn.spb.ru/img/appl_logo.png'},
        {tag: 'online', ext: 'appl_logo_plus.png'}
    );


    injectCustomStyle('.uploaded { background-color: lightblue !important; border-top: 1px solid white !important; }');
    injectCustomStyle('.tsn_logo { margin: 20px 0px !important;}');
    injectCustomStyle('.tsn_plus { cursor: pointer; font-size: 1.5em; color: green; padding: 3px}');
    injectCustomStyle('.tsn_remove { cursor: pointer; font-size: 1.5em; color: red; padding: 3px}');

    
    chrome.extension.onMessage.addListener(onTsnExtensionMessage);

    init();
}



function isExtEnable() {
    return (getValue('TSN_STATUS')===true) ? true : false;
}



function init() {
    if (!isExtEnable()) return;

    ifFireOnline(function() {
        tim.tag('online');

        addButtons();

        $('.results > tbody > tr input').hide();
        $('.tsn_plus').show();

        console.log('Расширение включено');
    });
}





function deinit() {
    //logoContainer.attr('src', "http://tsn.spb.ru/img/appl_logo.png");
    tim.tag('offline');
    $('.tsn_plus').hide();
    $('.tsn_remove').hide();

    $('.results > tbody > tr input').show();

    console.log('Расширение ВЫКЛЮЧЕНО!');

    cb = getCheckBoxes();
    for(i in cb) {
        toggleRowStyle('add_'+cb[i], 'uploaded', false);
    }
}




function uploadElement(e) {
    n = $(e).parent();
    f = parseRow(n);

    id = e.id.match(/\d+/)[0];

    chrome.extension.sendMessage({cmd: 'add', id: id, data: f});
    markRow(id);
}

function removeElement(e) {
    id = e.id.match(/\d+/)[0];

    chrome.extension.sendMessage({cmd: 'delete', id: id});
    unmarkRow(id);
}

function markRow(id) {
    toggleRowStyle('add_'+id, 'uploaded', true);
    $('#add_'+id).hide();
    $('#remove_'+id).show();
}

function unmarkRow(id) {
    toggleRowStyle('add_'+id, 'uploaded', false);
    $('#remove_'+id).hide();
    $('#add_'+id).show();
}




var addButtons = _.once(function() {
    addIndexedDiv('.results > tbody > tr input', 'add_', icons.plus, 'tsn_plus', 'click', function(e) {
        ifFireOnline(function() {
            uploadElement(e.target);
        });

    });

    addIndexedDiv('.results > tbody > tr input', 'remove_', icons.remove, 'tsn_remove', 'click', function(e) {
        ifFireOnline(function() {
            removeElement(e.target);
        });
    });

    $('#add_1').remove();
    $('#remove_1').remove();
});








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




function getCheckBoxes() {
    data = {};
    c_boxes = $("#submitForm input[name='selectedID[]']");
    c_boxes.each(function(i,v){ data[v.value] = v.value } );
    return data;
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
                    //toggleRowStyle(cbl[i], 'uploaded', true);
                    markRow(cbl[i]);
                }
            }

            break;
    }
}
