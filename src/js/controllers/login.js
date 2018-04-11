angular
    .module('app', ['ngAnimate', 'toastr', 'base64', 'ngStorage'])
    .factory('LoginService', LoginService)
    .controller('LoginCtr', LoginCtr)

LoginCtr.$inject = ['$scope', '$location', 'toastr', 'LoginService', '$localStorage'];
function LoginCtr($scope, $location, toastr, LoginService, $localStorage) {

    $scope.user = '';
    $scope.userErr = false;
    $scope.pwd = '';
    $scope.pwdErr = false;

    $scope.gotoRegister = function () {
        $location.path('/register');
    }

    $scope.doLogin = function () {
        $scope.userErr = false;
        $scope.pwdErr = false;
        if (!this.user) {
            toastr.error('Please input user name !', 'Warning');
            $scope.userErr = true;

            return;
        }
        if (!this.pwd) {
            $scope.pwdErr = true;
            toastr.error('Please input password !', 'Warning');
            return;
        }
        LoginService.doLog(this.user, this.pwd).then(function (success) {
            toastr.success('Accepted !', 'Success');
            $location.path('/dashboard');
            console.log(success.data.resource[0]);
            $scope.$storage = $localStorage.$default({
                user: success.data.resource[0]
            });
        }, function (error) {
            console.log(error)
            toastr.error(error.data.error.message, 'Warning');
        })
    }

}

LoginService.$inject = ['$http', '$base64'];
function LoginService($http, $base64) {
    return {
        doLog: function (email, pwd) {
            let url = 'https://df.cetsolution.com/api/v2/system/user?filter=email%3D' + email;
            return $http.get(url, {
                headers: {
                    'Authorization': 'Basic ' + $base64.encode(email + ':' + pwd),
                    'X-DreamFactory-Api-Key': '1c5f47e82c663486c6b495d7cf52b742b50fc17a2a134bd1c0714b443dcfd812'
                }
            }).then(function (response) {
                return response;
            })
        }
    }
}
