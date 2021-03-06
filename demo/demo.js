var app = angular.module('rzSliderDemo', ['rzModule', 'ui.bootstrap'])

app.controller('MainCtrl', function ($http, $scope, $rootScope, $timeout, $uibModal, $timeout) {

  initSlider();
  if($scope.spConf) $timeout(init);

  function init(){
    $http.get("dummydata.json").success(function(response) {   
      $scope.spData = response.Response;
      console.log('!!! amcust: $http.get() | 1 | success');
      console.log(angular.toJson($scope.spData));      
    })
    .error(function(data, status) {
      console.error('Repos error', status, data);
    })
    .then(function() {
      console.log('!!! amcust: $http.get() | 2 | then... ' + angular.toJson($scope.spConf));
      $scope.spConf.spActiveIndex = 0;
      $scope.spConf.spActive = {};    

      $scope.spConf.cp.spInverter = 570.92;// amcust 2do
      $scope.spConf.cp.rateBTW = $scope.spData.CalculationParameters.VAT;
      $scope.spConf.cp.ReclaimBTW = false;
      $scope.spConf.cp.ReclaimBTWPrice = 84.95;// amcust 2do
      $scope.spConf.cp.ShineOnService = false;
      $scope.spConf.cp.ShineOnServicePrice = $scope.spData.CalculationParameters.CostsService;
      
      if($scope.spData) $scope.selectProduct(0);
    });    
  }

  $scope.$watch('spConf', function(newValue, oldValue){
    if(!newValue) return;
    console.log('!!! amcust: $watch... $scope.spConf.spActive = ' + $scope.spConf.spActive);
    spConfUpdateCartValues();
  }, true);


  function spConfUpdateCartValues(){
    console.log('!!! amcust: spConfUpdateCartValues() | 1-2');
    if(!$scope.spConf.spActive) return;
    console.log('!!! amcust: spConfUpdateCartValues() | 2-2');
    $scope.spConf.cart = {};
    $scope.spConf.cart.PanelTotalPrice = $scope.spConf.spActive.Price * $scope.spConf.value;
    if($scope.spConf.options.smoothDrag) $scope.spConf.cart.PanelTotalPrice = $scope.spConf.spActive.Price * $scope.spConf.options.finalValue;
    $scope.spConf.cart.Subtotal = $scope.spConf.cart.PanelTotalPrice + ($scope.spConf.cp.ReclaimBTW && $scope.spConf.cp.ReclaimBTWPrice || 0) + $scope.spConf.cp.spInverter;
    $scope.spConf.cart.RefundBTW = $scope.spConf.cart.Subtotal * ($scope.spConf.cp.rateBTW / 100);
    $scope.spConf.cart.TotalInvestment = $scope.spConf.cart.Subtotal + ($scope.spConf.cp.ShineOnService && $scope.spConf.cp.ShineOnServicePrice || 0) - $scope.spConf.cart.RefundBTW;
  }

  function initSlider(){
    $scope.useSmoothDrag = false;

    $scope.spConf = {
      value: null,
      spActiveIndex: null,
      spActive: {},
      cart: {},
      cp: {},
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
          console.log('!!! amcust: options > optionBtnPlus() [' + $scope.spConf.value + ' -> ' + ($scope.spConf.value + 1) + ']');
          if ($scope.spConf.value < $scope.spConf.options.ceil) {
            if ($scope.spConf.options.smoothDrag) {
              $scope.spConf.value = $scope.spConf.value + 10;
              // $scope.spConf.value = ($scope.spConf.options.finalValue + 1) * 10;
            } else {
              $scope.spConf.value++;
            }          
          }
        },
        optionBtnMinus: function () {
          console.log('!!! amcust: options > optionBtnMinus() [' + $scope.spConf.value + ' -> ' + ($scope.spConf.value - 1) + ']');
          if (($scope.spConf.value > $scope.spConf.options.floor) && $scope.spConf.options.floor > 1) {          
            if ($scope.spConf.options.smoothDrag) {
              $scope.spConf.value = $scope.spConf.value - 10;
            // $scope.spConf.value = ($scope.spConf.options.finalValue - 1) * 10;
            } else {
              $scope.spConf.value--;
            }
          }
        }
      }
    }
  }

  // smoothDrag? (trick slider into multiples of 10 to make dragging smoother)
  function use10x(){    
    if(!$scope.usingSmoothDrag){// BUGFIX: need this to ensure values do not multiply every time we switch product
      $scope.usingSmoothDrag = true;
      $scope.spConf.options.finalValue = $scope.spConf.value;
      $scope.spConf.value *= 10;
    }
    // $scope.spConf.options.finalValue *= 10;
    $scope.spConf.options.floor *= 10;
    $scope.spConf.options.ceil *= 10;
    $scope.spConf.options.showAdvice *= 10;
    $scope.spConf.options.smoothDrag = true;    
  }

  $scope.toggleSmoothScroll = function(){
    use10x();
  }

  /* + button triggered outside of directive element */
  $scope.parentBtnPlus = function () {
    $scope.spConf.options.optionBtnPlus();
  }

  /* - button triggered outside of directive element */
  $scope.parentBtnMinus = function () {
    $scope.spConf.options.optionBtnMinus();
  }

  /* 
  vm.refreshSlider = function() {
    $timeout(function() {
      $scope.$broadcast('rzSliderForceRender')
    })
  }
  */

  

  $scope.selectProduct = function(getIndex = 0) {
    console.log('!!! amcust: selectProduct() > ' + $scope.spData.AvailablePanels[getIndex].Name);
    
    $scope.spConf.options.ceil = $scope.spData.AvailablePanels[getIndex].MaxPanels;
    $scope.spConf.options.floor = $scope.spData.AvailablePanels[getIndex].MinPanels;
    $scope.spConf.options.showAdvice = 10;// amcust 2do - get from API
    $scope.spConf.options.powerOutput = $scope.spData.AvailablePanels[getIndex].kWh;
    
    if(!$scope.spConf.value) $scope.spConf.value = $scope.spConf.options.showAdvice;

    $scope.spConf.spActiveIndex = getIndex;
    $scope.spConf.spActive = $scope.spData.AvailablePanels[getIndex];
    if($scope.useSmoothDrag) use10x();
  }

  $scope.spConfSetReclaimBTW = function(getBoolean){
    console.log('!!! scSetReclaimBTW() > ' + getBoolean);
    $scope.spConf.cp.ReclaimBTW = getBoolean;
  }

  $scope.spConfSetShineOnService = function(getBoolean){
    console.log('!!! scSetShineOnService() > ' + getBoolean);
    $scope.spConf.cp.ShineOnService = getBoolean;
  }

})