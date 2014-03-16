var login = 'no';

function listen_login() {
	var source = new EventSource('php/check_login.php');
	source.onmessage = function(e) {
		if(e.data != login) {
			if(e.data == 'no') {
				onLogout();
			} else {
				onLogin(e.data);
			}
		}
	};
}

function onLogin(user_id) {
}

function onLogout() {
}