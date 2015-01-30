//
//
// JavaScript Utils
//
//

function newClass(c) {
    tmp = {};
    delete arguments[0];
    tmp.__proto__ = c;
    c.init(arguments);
    return tmp;
}

function Thread(proc) {
	setTimeout(function() {
		proc();
	}.bind(this), 0);
}