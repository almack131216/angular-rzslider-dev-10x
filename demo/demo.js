var app = angular.module('rzSliderDemo', ['rzModule', 'ui.bootstrap'])

app.controller('MainCtrl', function ($scope, $rootScope, $timeout, $uibModal) {

  $scope.useSmoothScroll = false;

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
      smoothDrag: false,
      optionBtnPlus: function () {
        console.log('!!! amcust: options > optionBtnPlus() [' + $scope.amcustDebugSlider.value + ' -> ' + ($scope.amcustDebugSlider.value + 1) + ']');
        if ($scope.amcustDebugSlider.value < $scope.amcustDebugSlider.options.ceil) {
          if ($scope.amcustDebugSlider.options.smoothDrag) {
            $scope.amcustDebugSlider.value = $scope.amcustDebugSlider.value + 10;
            // $scope.amcustDebugSlider.value = ($scope.amcustDebugSlider.options.finalValue + 1) * 10;
          } else {
            $scope.amcustDebugSlider.value++;
          }          
        }
      },
      optionBtnMinus: function () {
        console.log('!!! amcust: options > optionBtnMinus() [' + $scope.amcustDebugSlider.value + ' -> ' + ($scope.amcustDebugSlider.value - 1) + ']');
        if (($scope.amcustDebugSlider.value > $scope.amcustDebugSlider.options.floor) && $scope.amcustDebugSlider.options.floor > 1) {          
          if ($scope.amcustDebugSlider.options.smoothDrag) {
            $scope.amcustDebugSlider.value = $scope.amcustDebugSlider.value - 10;
          // $scope.amcustDebugSlider.value = ($scope.amcustDebugSlider.options.finalValue - 1) * 10;
          } else {
            $scope.amcustDebugSlider.value--;
          }
        }
      }
    },
  }

  function use10x(){
    $scope.amcustDebugSlider.options.finalValue = $scope.amcustDebugSlider.value;
    $scope.amcustDebugSlider.value = $scope.amcustDebugSlider.value * 10;
    $scope.amcustDebugSlider.options.finalValue = $scope.amcustDebugSlider.options.finalValue * 10;
    $scope.amcustDebugSlider.options.floor = $scope.amcustDebugSlider.options.floor * 10;
    $scope.amcustDebugSlider.options.ceil = $scope.amcustDebugSlider.options.ceil * 10;
    $scope.amcustDebugSlider.options.showAdvice = $scope.amcustDebugSlider.options.showAdvice * 10;
    $scope.amcustDebugSlider.options.smoothDrag = true;
  }

  if($scope.useSmoothScroll) use10x();

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