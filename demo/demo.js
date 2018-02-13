var app = angular.module('rzSliderDemo', ['rzModule', 'ui.bootstrap'])

app.controller('MainCtrl', function ($http, $scope, $rootScope, $timeout, $uibModal, $timeout) {

  

  $timeout(init);

  function init(){
    $scope.activeSolarPanelIndex = null;
    $scope.activeSolarPanel = null;


    $scope.rateBTW = 0.21;
    $scope.ReclaimBTW = false;
    $scope.ReclaimBTWPrice = 84.95;
    $scope.ShineOnService = false;
    $scope.ShineOnServicePrice = 29.95;

    initSlider();
  }

  $http.get("dummydata.json").success(function(response) {   
    $scope.dummyData = response;
    console.log('!!!');
    console.log(angular.toJson($scope.dummyData));
  });

  $scope.$watch('amcustDebugSlider', function(newValue, oldValue){
    // console.log('being watched oldValue:', oldValue, 'newValue:', newValue);
    if(!newValue) return;

    scUpdateCart();

  }, true);

  function scUpdateCart(){
    $scope.scCartTable = {}
    $scope.scCartTable.PanelTotalPrice = $scope.activeSolarPanel.Costs * $scope.amcustDebugSlider.value;
    $scope.scCartTable.Subtotal = $scope.scCartTable.PanelTotalPrice + ($scope.ShineOnService && $scope.ShineOnServicePrice || 0) + ($scope.ReclaimBTW && $scope.ReclaimBTWPrice || 0);
    $scope.scCartTable.RefundBTW = $scope.scCartTable.Subtotal * $scope.rateBTW;
  }

  function initSlider(){
    $scope.useSmoothDrag = false;

    $scope.amcustDebugSlider = {
      value: null,
      options: {
        showTicks: 1,
        showTicksValues: 1,
        floor: 4,
        ceil: null,
        step: 1,
        showSelectionBar: false,
        showAdvice: null,
        powerOutput:null,      
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
      }
    }
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

  if($scope.useSmoothDrag) use10x();

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

  $scope.selectProduct = function(getIndex = 0) {
    console.log($scope.dummyData.AvailablePanels[getIndex].name);
    
    $scope.amcustDebugSlider.options.ceil = $scope.dummyData.AvailablePanels[getIndex].Max_panels;
    $scope.amcustDebugSlider.options.showAdvice = 10;// amcust - need DYNAMIC
    $scope.amcustDebugSlider.options.powerOutput = $scope.dummyData.AvailablePanels[getIndex].kwh;
    
    if(!$scope.amcustDebugSlider.value) $scope.amcustDebugSlider.value = $scope.amcustDebugSlider.options.showAdvice;

    $scope.activeSolarPanelIndex = getIndex;
    $scope.activeSolarPanel = $scope.dummyData.AvailablePanels[getIndex];
    scUpdateCart();
  }

  if($scope.dummyData) $scope.selectProduct($scope.activeSolarPanelIndex);

  $scope.scSetReclaimBTW = function(getBoolean){
    console.log('!!! scSetReclaimBTW() > ' + getBoolean);
    $scope.ReclaimBTW = getBoolean;
    scUpdateCart();
  }

  $scope.scSetShineOnService = function(getBoolean){
    console.log('!!! scSetShineOnService() > ' + getBoolean);
    $scope.ShineOnService = getBoolean;
    scUpdateCart();
  }

})