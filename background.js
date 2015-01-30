//Firebase.enableLogging(true);
var icon = newClass(ChromeIcon);
var bg_scope = this;

cnt = 0;

//setInterval(function(){
    // icon.clear();
    // icon.text('', 'seagreen');
    // icon.show();
//    if (++cnt>99) cnt=0;
//}, 100);

initBackground();


var oldTsnStatus = getValue('TSN_STATUS');

firebaseLogin.bind(this);


function initBackground() {
    
    chrome.tabs.onUpdated.addListener(onUpdateTsn);

    //var ref = new Firebase(FIREBASE);
    tid = null;
    getFire().onAuth(function(authData) {
        if (authData) {
            console.log("Authenticated with uid:", authData.uid);
            icon.clear();
            icon.text('', 'darkgreen');
            icon.show();

            if (!getValue('TSN_STATUS'))
                localStorage['TSN_STATUS'] = oldTsnStatus;

            if (getValue('TSN_STATUS')) enableTsn();

        } else {
            console.log("Client unauthenticated. Try to login...");

            oldTsnStatus = getValue('TSN_STATUS');
            disableTsn();

            icon.clear();
            icon.text('', 'darkred');
            icon.show();
            
//            setTimeout(function(){firebaseLogin();},0);
            Thread(function() {
                firebaseLogin();
            });
            
        }
    });


    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        //console.log('request: ', request);//, sender, sendResponse);
        var auth = getFire().getAuth();
        if (!auth) {
            console.log("You need to authorize Firebase");
            return;
        }

        if (request && request.cmd)
        switch(request.cmd) {
            case 'add':
                rent = getFire().child(auth.uid).child('rent').child(request.id);
                rent.set(request.data);

                break;

            case 'delete':
                rent = getFire().child(auth.uid).child('rent').child(request.id);
                rent.remove();

                break;

            case 'get_fire_status':
                sendResponse({data: isFireAuth()});
                break;
        }
    });

    //
    // обработчик нажатия иконки приложения на панели
    //
    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendRequest(
            tab.id,
            {cmd:'click'}
        );
    });
}




