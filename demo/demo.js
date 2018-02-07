var app = angular.module('rzSliderDemo', ['rzModule', 'ui.bootstrap'])

app.controller('MainCtrl', function ($scope, $rootScope, $timeout, $uibModal) {
  //Minimal slider config
  $scope.minSlider = {
    value: 10,
  }
  $scope.amcustDebugSlider = {
    value: 7,
    options: {
      showTicks: 1,
      showTicksValues: 1,
      floor: 4,
      ceil: 12,
      step: 1,
      showSelectionBar: false,
      showAdvice: 10,
      powerOutput:0.2565,
      optionBtnPlus: function () {
        console.log('!!! amcust: options > optionBtnPlus() [' + $scope.amcustDebugSlider.value + ' -> ' + ($scope.amcustDebugSlider.value + 1) + ']');
        if ($scope.amcustDebugSlider.value < $scope.amcustDebugSlider.options.ceil) {
          $scope.amcustDebugSlider.value++;
        }
      },
      optionBtnMinus: function () {
        console.log('!!! amcust: options > optionBtnMinus() [' + $scope.amcustDebugSlider.value + ' -> ' + ($scope.amcustDebugSlider.value - 1) + ']');
        if (($scope.amcustDebugSlider.value > $scope.amcustDebugSlider.options.floor) && $scope.amcustDebugSlider.options.floor > 1) {
          $scope.amcustDebugSlider.value--;
        }
      }
    },
  }

  /* + button triggered outside of directive element */
  $scope.parentBtnPlus = function () {
    $scope.amcustDebugSlider.options.optionBtnPlus();
  }

  /* - button triggered outside of directive element */
  $scope.parentBtnMinus = function () {
    $scope.amcustDebugSlider.options.optionBtnMinus();
  }

  /* 
  vm.refreshSlider = function() {
  $timeout(function() {
    $scope.$broadcast('rzSliderForceRender')
  })
}
*/

})