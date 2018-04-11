angular
    .module('app', ['ngAnimate', 'toastr'])
    .factory('doRegister', doRegister)
    .controller('RegisterCtr', RegisterCtr)

RegisterCtr.$inject = ['$scope', '$location', 'toastr', 'doRegister'];
function RegisterCtr($scope, $location, toastr, doRegister) {

    $scope.user = {
        value: '',
        isErr: false
    };
    $scope.firstName = {
        value: '',
        isErr: false
    };
    $scope.lastName = {
        value: '',
        isErr: false
    };
    $scope.email = {
        value: '',
        isErr: false
    };
    $scope.pwd = {
        value: '',
        isErr: false
    };
    $scope.repwd = {
        value: '',
        isErr: false
    };

    $scope.re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    $scope.doRegister = function () {
        toastr.clear();
        listCheck = [
            { id: 'user', value: this.user, message: 'Please input username!' },
            { id: 'firstName', value: this.firstName, message: 'Please input first name!' },
            { id: 'lastName', value: this.lastName, message: 'Please input last name!' },
            { id: 'email', value: this.email, message: 'Please input email!' },
            { id: 'pwd', value: this.pwd, message: 'Please input password!' },
            { id: 'repwd', value: this.repwd, message: 'Please repeat password!' }
        ]
        for (var item of listCheck) {
            item.value.isErr = false
            if (!item.value.value) {
                item.value.isErr = true;
                toastr.error(item.message, 'Warning');
                return;
            } else {
                if (item.id === 'pwd' && item.value.value.toString().split('').length < 6) {
                    toastr.error('The password must be at least 6 characters!', 'Warning');
                    return;
                }
                if (item.id === 'email' && !this.re.test(String(item.value.value).toLowerCase())) {
                    toastr.error('Invalid email format!', 'Warning');
                    return;
                }
                if (item.id === 'repwd' && (this.pwd.value !== this.repwd.value)) {
                    toastr.error('Repeat password fail!', 'Warning');
                    return;
                }
            }
        }
        var data = {
            "resource": [
                {
                    "name": this.user.value,
                    "first_name": this.firstName.value,
                    "last_name": this.lastName.value,
                    "email": this.email.value,
                    "password": this.pwd.value
                }
            ]
        }
        doRegister.doReg(data).then(function (success) {
            toastr.success('Login now !', 'Success');
            $location.path('/login');
            console.log(success)
        }, function (error) {
            console.log(error)
            toastr.error(error.data.error.message, 'Warning');
        })
    }
}

doRegister.$inject = ['$http', 'toastr'];
function doRegister($http, toastr) {
    return {
        doReg: function (data) {
            let url = 'https://df.cetsolution.com/api/v2/system/user';
            return $http.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-DreamFactory-Api-Key': '1c5f47e82c663486c6b495d7cf52b742b50fc17a2a134bd1c0714b443dcfd812'
                }
            }).then(function (response) {
                return response;
            })
        }
    }
}