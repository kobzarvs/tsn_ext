//
//
// TSN shared inerface
//
//


function ifFireOnline(callback) {
    chrome.extension.sendMessage('ajbehjoeddgfbhdfhjdmjkajjnamekag', {cmd: 'get_fire_status'}, function(data) {
        // console.log('resp: ', data);
        if (data && data['data'])
            callback();
        else
            console.log("firebase is offline");
    });
}


function disableTsn() {
    localStorage['TSN_STATUS'] = false;
    messageToAllTsn({cmd:'status', status:false});
}



function enableTsn() {
    localStorage['TSN_STATUS'] = true;

    forTabsWithUrl(
        TSNURL,
        function(tab) {
            requestToTab(tab.id, {cmd:'status', status:true}, function(data) {
                console.log('update', tab.id, data);
                onUpdateTsn(tab.id, 'complete', tab);
            }.bind(this));
        }.bind(this),
        null,
        false
    );
}




function onUpdateTsn(id, status, tab) {

    if (tab.status=='complete' && tab.url.contains(TSNURL)) {
        requestToTab(id, {cmd: 'getCheckBoxes'}, function(cbData) {
            if (!cbData || !cbData['checkBoxes']) {
                return;
            }

            getFireRecords('rent', function(records) {
                if (!records) {
                    return;
                }

                for(i in cbData['checkBoxes']) {
                    if (!records[i]) {
                        delete cbData['checkBoxes'][i];
                    }
                }

                requestToTab(id, {cmd: 'setCheckBoxes', data: cbData.checkBoxes}, function() {
                });
            }.bind(this));
        }.bind(this));
    }
}





function messageToAllTsn(cmdBlock) {
    forTabsWithUrl(
        TSNURL,
        function(tab) {
            requestToTab(tab.id, cmdBlock);
        },
        null,
        false
    );
}

