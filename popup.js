document.addEventListener('DOMContentLoaded', function () {

    $('#fireBtnLogin').on('click', function(e) {
        fireUrl = FIREAPP;
        
        forTabsWithUrl(
            fireUrl,
            function(tab) {
                chrome.tabs.update(tab.id, {active: true});
            },
            function() {
                chrome.tabs.create({url: fireUrl});
            },
            true
        );
    });


    var  fire_status = undefined;
    fire_status = setAuthStatus(fire_status);

    setTsnStatus();

    setInterval(function() {
        fire_status = setAuthStatus(fire_status);
    }, 250);

    //$('#tsnStatus').text(localStorage.tsn || 0);
});


function setTsnStatus() {
    if (!getValue('TSN_STATUS')) {
        $('#extStatus').html('<div id="extStatus"><div id="tsnBtnEnable" class="ui labeled icon button"><i class="power icon red" />Включить расширение</div></div>');
        $('#tsnBtnEnable').on('click', function(e) {
            enableTsn();
            setTsnStatus();
        });
    } else {
        $('#extStatus').html('<div id="extStatus"><div id="tsnBtnDisable" class="ui labeled icon button"><i class="power icon green" />Отключить расширение"</div></div>');
        $('#tsnBtnDisable').on('click', function(e) {
            disableTsn();
            setTsnStatus();
        });
    }
}

function setAuthStatus(status) {
    if (getValue('AUTH_TOKEN')===undefined && (status===true || status===undefined)) {
        $('#fireStatus').text('Offline');
        $('#fireStatus').switchClass('online', 'offline');
        $('#fireBtnLogin').show(); //removeAttr("disabled");
        status = false;
        disableTsn();
        setTsnStatus();
        $('#extStatus').hide();//attr("disabled", "disabled");

    } else if (getValue('AUTH_TOKEN')!==undefined && (status===false || status===undefined)) {
        $('#fireStatus').text('Online');
        $('#fireStatus').switchClass('offline', 'online');
        $('#fireBtnLogin').hide(); //attr("disabled", "disabled");

        status = true;
        $('#extStatus').show(); //removeAttr("disabled");
    }

    return status;
}




