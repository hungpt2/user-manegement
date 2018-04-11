//main.js
angular
  .module('app', ['ngStorage', 'toastr', 'base64'])
  .controller('dashboardCtrl', dashboardCtrl)
  .factory('doEditService', doEditService)

dashboardCtrl.$inject = ['$scope', '$location', '$localStorage', 'toastr', 'doEditService'];
function dashboardCtrl($scope, $location, $localStorage, toastr, doEditService) {

  $scope.acc = {};
  $scope.OnInit = function () {
    if (!$localStorage['user']) {
      $location.path('/login');
      return;
    }
    doEditService.getUserById($localStorage['user']).then(function (success) {
      this.acc = success.data.resource[0];
      console.log(this.acc)
      $scope.user = this.acc.name;
      $scope.firstName = this.acc.first_name;
      $scope.lastName = this.acc.last_name;
      $scope.email = this.acc.email;
    }, function (error) {
      toastr.error(error.data.error.message, 'Warning');
    })
  }();

  $scope.userErr = false;
  $scope.firstNameErr = false;
  $scope.lastNameErr = false;
  $scope.emailErr = false;
  $scope.re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  $scope.doEdit = function () {
    toastr.clear();
    this.userErr = false;
    this.firstNameErr = false;
    this.lastNameErr = false;
    this.emailErr = false;
    if (!this.user) {
      this.userErr = true;
      toastr.error('Please input username!', 'Warning');
      return;
    }
    if (!this.firstName) {
      this.firstNameErr = true;
      toastr.error('Please input first name!', 'Warning');
      return;
    }
    if (!this.lastName) {
      this.lastNameErr = true;
      toastr.error('Please input last name!', 'Warning');
      return;
    }
    if (!this.email || !this.re.test(String(this.email).toLowerCase())) {
      this.emailErr = true;
      toastr.error('Please input invalid email format!', 'Warning');
      return;
    }
    var data = {
      "resource": [
        {
          "name": this.user,
          "first_name": this.firstName,
          "last_name": this.lastName,
          "email": this.email
        }
      ]
    }
    doEditService.doEdit(data, $localStorage['user']).then(function (success) {
      toastr.success('Completed !', 'Success');
    }, function (error) {
      toastr.error(error.data.error.message, 'Warning');
    })
  }
}

doEditService.$inject = ['$http', 'toastr', '$base64'];
function doEditService($http, toastr, $base64) {
  return {
    doEdit: function (data, user) {
      let url = 'https://df.cetsolution.com/api/v2/system/user?ids=' + user.id;
      return $http.patch(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic amRvZUBleGFtcGxlLmNvbTpzZWNyZXQ=',
          // 'Authorization': 'Basic ' + $base64.encode(user.email + ':' + pwd),
          'X-DreamFactory-Api-Key': '1c5f47e82c663486c6b495d7cf52b742b50fc17a2a134bd1c0714b443dcfd812'
        }
      }).then(function (response) {
        return response;
      })
    },
    getUserById: function (user) {
      let url = 'https://df.cetsolution.com/api/v2/system/user?ids=' + user.id;
      return $http.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic amRvZUBleGFtcGxlLmNvbTpzZWNyZXQ=',
          // 'Authorization': 'Basic ' + $base64.encode(user.email + ':' + pwd),
          'X-DreamFactory-Api-Key': '1c5f47e82c663486c6b495d7cf52b742b50fc17a2a134bd1c0714b443dcfd812'
        }
      }).then(function (response) {
        return response;
      })
    }
  }
}