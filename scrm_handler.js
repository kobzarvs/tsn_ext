var authStatus = false;


if (window.location.href.contains(FIREAPP)) {
    chrome.extension.onMessage.addListener(onFireExtensionMessage);
}


function onFireExtensionMessage(request, ext, resp) {
    console.log('REQUEST to FIRE: ', request);

    if (request['cmd']==undefined)
        return;

    switch(request['cmd']) {
        case 'getToken':
            console.log('send token');
            if (localStorage['firebase:session::blistering-heat-2586']) {
                token = JSON.parse(localStorage['firebase:session::blistering-heat-2586']).token;
                console.log(token);
                resp({token: token});
            } else {
                console.log('token not found');
                resp({token: undefined});
            }
            break;
    }
}
