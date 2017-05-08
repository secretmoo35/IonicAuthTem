angular.module('your_app_name.auth.controllers', [])

	.controller('AuthCtrl', function ($scope) {

	})

	.controller('WelcomeCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal, show_hidden_actions, $state, AuthService) {

		$scope.show_hidden_actions = show_hidden_actions;

		$scope.toggleHiddenActions = function () {
			$scope.show_hidden_actions = !$scope.show_hidden_actions;
		};

		$scope.facebookSignIn = function (provider) {
			console.log("doing facebbok sign in");
			AuthService.authenticate(provider);
			// $state.go('app.feed');
		};

		$rootScope.$on('userLoggedIn', function (data) {
			// here we will recieve the logged in user
			$state.go('app.feed');
		});

		// will fire in case authentication failed
		$rootScope.$on('userFailedLogin', function () {
			var myPopup = $ionicPopup.show({
				template: 'Facebook login fail.',
				title: 'Error',
				subTitle: '(Login)',
				scope: $scope,
				buttons: [{
					text: '<b>Try Again</b>',
					type: 'button-positive'
				}]
			});
		});


		$scope.googleSignIn = function () {
			console.log("doing google sign in");
			$state.go('app.feed');
		};

		$scope.twitterSignIn = function () {
			console.log("doing twitter sign in");
			$state.go('app.feed');
		};

		$ionicModal.fromTemplateUrl('views/app/legal/privacy-policy.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.privacy_policy_modal = modal;
		});

		$ionicModal.fromTemplateUrl('views/app/legal/terms-of-service.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.terms_of_service_modal = modal;
		});

		$scope.showPrivacyPolicy = function () {
			$scope.privacy_policy_modal.show();
		};

		$scope.showTerms = function () {
			$scope.terms_of_service_modal.show();
		};
	})

	.controller('LogInCtrl', function ($scope, $state, AuthService, $ionicPopup, $timeout) {
		$scope.user = {};
		$scope.doLogIn = function () {
			console.log("doing log in");
			AuthService.login($scope.user).then(function (data) {
				$state.go('app.feed');
			}, function (err) {
				var myPopup = $ionicPopup.show({
					template: err.data.message,
					title: 'Error',
					subTitle: '(Login)',
					scope: $scope,
					buttons: [{
						text: '<b>Try Again</b>',
						type: 'button-positive'
					}]
				});
			});
		};
	})

	.controller('SignUpCtrl', function ($scope, $state, AuthService, $ionicPopup, $timeout) {
		$scope.user = {};
		$scope.doSignUp = function () {
			console.log("doing sign up");
			AuthService.signup($scope.user).then(function (data) {
				$state.go('app.feed');
			}, function (err) {
				var myPopup = $ionicPopup.show({
					template: err.data.message,
					title: 'Error',
					subTitle: '(Sign up)',
					scope: $scope,
					buttons: [{
						text: '<b>Try Again</b>',
						type: 'button-positive'
					}]
				});
			});
		};
	})

	.controller('ForgotPasswordCtrl', function ($scope, $state) {
		$scope.requestNewPassword = function () {
			console.log("requesting new password");
			$state.go('app.feed');
		};
	})

	;
