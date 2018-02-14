var app = angular.module('rzSliderDemo', ['rzModule', 'ui.bootstrap'])

app.controller('MainCtrl', function ($http, $scope, $rootScope, $timeout, $uibModal, $timeout) {

  initSlider();
  if($scope.sc) $timeout(init);

  function init(){
    $http.get("dummydata.json").success(function(response) {   
      $scope.dummyData = response;
      console.log('!!! amcust: $http.get() | 1 | success');
      console.log(angular.toJson($scope.dummyData));      
    })
    .error(function(data, status) {
      console.error('Repos error', status, data);
    })
    .then(function() {
      

      console.log('!!! amcust: $http.get() | 2 | then... ' + angular.toJson($scope.sc));
      $scope.sc.base.activeSolarPanelIndex = 0;
      $scope.sc.base.activeSolarPanel = {};    

      $scope.sc.base.scInverter = 570.92;
      $scope.sc.base.rateBTW = 0.21;
      $scope.sc.base.ReclaimBTW = false;
      $scope.sc.base.ReclaimBTWPrice = 84.95;
      $scope.sc.base.ShineOnService = false;
      $scope.sc.base.ShineOnServicePrice = 29.95;
      
      console.log('!!! amcust: $http.get() | 3 | finally... ' + $scope.sc.base.activeSolarPanelIndex);
      if($scope.dummyData) $scope.selectProduct(0);
      console.log('!!! amcust: $http.get() | 3 | finally... ' + $scope.sc.base.activeSolarPanel.Costs);
      // scUpdateCartValues();
    });    
  }

  $scope.$watch('sc', function(newValue, oldValue){
    if(!newValue) return;
    console.log('!!! amcust: $watch... $scope.sc.base.activeSolarPanel = ' + $scope.sc.base.activeSolarPanel);
    scUpdateCartValues();
  }, true);


  function scUpdateCartValues(){
    console.log('!!! amcust: scUpdateCartValues() | 1');
    if(!$scope.sc.base.activeSolarPanel) return;
    console.log('!!! amcust: scUpdateCartValues() | 2');
    $scope.sc.cart = {};
    $scope.sc.cart.PanelTotalPrice = $scope.sc.base.activeSolarPanel.Costs * $scope.sc.value;
    $scope.sc.cart.Subtotal = $scope.sc.cart.PanelTotalPrice + ($scope.sc.base.ReclaimBTW && $scope.sc.base.ReclaimBTWPrice || 0) + $scope.sc.base.scInverter;
    $scope.sc.cart.RefundBTW = $scope.sc.cart.Subtotal * $scope.sc.base.rateBTW;
    $scope.sc.cart.TotalInvestment = $scope.sc.cart.Subtotal + ($scope.sc.base.ShineOnService && $scope.sc.base.ShineOnServicePrice || 0) - $scope.sc.cart.RefundBTW;
  }

  function initSlider(){
    $scope.useSmoothDrag = false;

    $scope.sc = {
      value: null,
      cart: {},
      base: {},
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
          console.log('!!! amcust: options > optionBtnPlus() [' + $scope.sc.value + ' -> ' + ($scope.sc.value + 1) + ']');
          if ($scope.sc.value < $scope.sc.options.ceil) {
            if ($scope.sc.options.smoothDrag) {
              $scope.sc.value = $scope.sc.value + 10;
              // $scope.sc.value = ($scope.sc.options.finalValue + 1) * 10;
            } else {
              $scope.sc.value++;
            }          
          }
        },
        optionBtnMinus: function () {
          console.log('!!! amcust: options > optionBtnMinus() [' + $scope.sc.value + ' -> ' + ($scope.sc.value - 1) + ']');
          if (($scope.sc.value > $scope.sc.options.floor) && $scope.sc.options.floor > 1) {          
            if ($scope.sc.options.smoothDrag) {
              $scope.sc.value = $scope.sc.value - 10;
            // $scope.sc.value = ($scope.sc.options.finalValue - 1) * 10;
            } else {
              $scope.sc.value--;
            }
          }
        }
      }
    }
  }

  // smoothDrag? (trick slider into multiples of 10 to make dragging smoother)
  function use10x(){
    $scope.sc.options.finalValue = $scope.sc.value;
    $scope.sc.value = $scope.sc.value * 10;
    $scope.sc.options.finalValue = $scope.sc.options.finalValue * 10;
    $scope.sc.options.floor = $scope.sc.options.floor * 10;
    $scope.sc.options.ceil = $scope.sc.options.ceil * 10;
    $scope.sc.options.showAdvice = $scope.sc.options.showAdvice * 10;
    $scope.sc.options.smoothDrag = true;
  }
  if($scope.useSmoothDrag) use10x();

  /* + button triggered outside of directive element */
  $scope.parentBtnPlus = function () {
    $scope.sc.options.optionBtnPlus();
  }

  /* - button triggered outside of directive element */
  $scope.parentBtnMinus = function () {
    $scope.sc.options.optionBtnMinus();
  }

  /* 
  vm.refreshSlider = function() {
    $timeout(function() {
      $scope.$broadcast('rzSliderForceRender')
    })
  }
  */

  

  $scope.selectProduct = function(getIndex = 0) {
    console.log('!!! amcust: selectProduct() > ' + $scope.dummyData.AvailablePanels[getIndex].name);
    
    $scope.sc.options.ceil = $scope.dummyData.AvailablePanels[getIndex].Max_panels;
    $scope.sc.options.showAdvice = 10;// amcust - need DYNAMIC
    $scope.sc.options.powerOutput = $scope.dummyData.AvailablePanels[getIndex].kwh;
    
    if(!$scope.sc.value) $scope.sc.value = $scope.sc.options.showAdvice;

    $scope.sc.base.activeSolarPanelIndex = getIndex;
    $scope.sc.base.activeSolarPanel = $scope.dummyData.AvailablePanels[getIndex];
  }

  $scope.scSetReclaimBTW = function(getBoolean){
    console.log('!!! scSetReclaimBTW() > ' + getBoolean);
    $scope.sc.base.ReclaimBTW = getBoolean;
  }

  $scope.scSetShineOnService = function(getBoolean){
    console.log('!!! scSetShineOnService() > ' + getBoolean);
    $scope.sc.base.ShineOnService = getBoolean;
  }

})