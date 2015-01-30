//
//
// CRM shared interface
//
//

function requestAuthTokenFromCRM(tabId, cb) {
    // console.log('request sended: ', tabId);
    chrome.tabs.sendMessage(
        tabId,
        {cmd:'getToken'},
        function(data) {
            // console.log('response: ', data);
            if (data && data['token']) {
                cb(data.token);
            } else {
                cb(undefined);
            }
        }
    );
}






function requestAuthTokenFromAllCRM() {

    function tokenNotFoundInTabs() {
        console.log("Auth token not found in tabs!");
        TID = setTimeout(function(){
            firebaseLogin();
        },5000);
    };

    forTabsWithUrl(
        FIREAPP,
        function(tab) {
            requestAuthTokenFromCRM(tab.id, function(token) {
                // console.log('id: ', tab.id, ' token: ', token);
                if (token!==undefined) {
                    localStorage['AUTH_TOKEN'] = token;
                    firebaseLogin();
                } else {
                    tokenNotFoundInTabs();
                }
            });
        },
        function() {
            tokenNotFoundInTabs();
        },
        true
    );
}
