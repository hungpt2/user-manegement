angular
    .module('app')
    .controller('navbarCtr', navbarCtr)

navbarCtr.$inject = ['$scope', '$location', '$localStorage'];
function navbarCtr($scope, $location, $localStorage) {
    $scope.doLogout = function () {
        $localStorage.$reset();
        $location.path('/login');
    }
}