/// <reference path="../../../node_modules/@types/angular/index.d.ts" />

let app = angular.module('app', []);

app.controller('TaskController', ['$scope', '$http', ($scope, $http) => {
    console.log('ng');
    $scope.tasks = [];
    $scope.addTask = () => {
        console.log('Adding task:', $scope.taskNameIn);
        $http.post('/addTask', {
            name: $scope.taskNameIn
        }).then((response) => {
            console.log('Back from server', response);
            $scope.tasks = response.data;
        }, (response) => {
            console.log('Error from server', response);
        });
    }
}])

console.log("ts");
