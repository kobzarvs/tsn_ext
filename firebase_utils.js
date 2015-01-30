var ref = new Firebase(FIREBASE);



function getFire() {
    return ref;
};


function isFireAuth() {
  return getFire().getAuth();
}



function firebaseLogin() {
  if (!getValue('AUTH_TOKEN')) {
    requestAuthTokenFromAllCRM();
  } else {
    getFire().authWithCustomToken(localStorage['AUTH_TOKEN'], function(error, authData) {
      if (error) {
        console.log("Login with local token Failed! Try to find it...", error);
        requestAuthTokenFromAllCRM();
      } else {
        console.log("Login with local token succeeded!");
        localStorage['AUTH_TOKEN'] = authData.token;
      }
    });
  }
};





function getFireRecords(path, callback) {
    //ref = new Firebase(FIREBASE);

    auth = getFire().getAuth();
    if (!auth) return;

    rent = getFire().child(auth.uid).child(path);
    rent.once('value', function(result) {
        callback(result.val());
    }, function(error) {
        console.log('forEachFire error:',error);
    });
};


