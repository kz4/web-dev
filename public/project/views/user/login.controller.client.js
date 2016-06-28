(function () {
	angular
		.module("ProjectMaker")
		.controller("LoginController", LoginController);

	function LoginController($location, UserService, $rootScope) {
		var vm = this;
		vm.login = login;
		vm.submitted = false;
		vm.currentUser = $rootScope.currentUser;
		vm.logout = logout;

		function logout() {
			$rootScope.currentUser = null;
			UserService
				.logout()
				.then(
					function (res) {
						$location.url("/login");
					},
					function () {
						$location.url("/login");
					}
				);
		}

		function login(username, password) {
			vm.submitted = true;
			UserService
			// .findUserByCredentials(username, password)  // promise
				.login(username, password)  // promise
				.then(function (res) {
						var user = res.data;
						if (user && user._id) {
							var id = user._id;
							if (user.userType === "ADMIN") {
								$location.url("/admin/" + id);
							} else {
								$location.url("/user/" + id);
							}
							vm.submitted = false;
						} else {
							vm.error = "User not found";
						}
					},
					function (error) {
						vm.error = "User not found";
					});
		}
	}
})();