var stockApp = angular.module("stockApp",['ngRoute','ngResource']);

stockApp.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'pages/dates.html',
        controller:'datesController'
    })
    .when('/details',{
        templateUrl:'pages/details.html',
        controller:'detailController'
    })
});
//services
stockApp.service("stockService",function($resource, $q){
    
    this.endDate = new Date();
    this.startDate = new Date();
    this.stockName = "ORB";

    this.startDate.setDate(this.endDate.getDate()-30);
    console.log(this.stockName);

    
    this.info = function(stockName){
      console.log(stockName);
        var stockAPI  = $resource("https://www.quandl.com/api/v3/datasets/OPEC/"+ this.stockName +".json/");
        var stockDataAll = stockAPI.get({start_date:this.startDate , end_date :this.endDate, api_key:'JNxtxN6Co3ayb6TZThzq'});
       // return stockDataAll;
        var stockData = stockDataAll;
        var deferred = $q.defer();
        stockData.$promise.then(function(result){
            console.log(result);
            var resultArr = [];
            var dateArr =[];
            var priceArr = [];

            for(var i in result.dataset.data){
                dateArr[i] = result.dataset.data[i][0];
                priceArr[i] = result.dataset.data[i][1];
            }

            resultArr.push(dateArr, priceArr);

            deferred.resolve(resultArr);
        }, function(err){
            console.log('Error');
        });
        this.res = deferred.promise;
       return stockDataAll;
    }
    
//    var stockAPI  = $resource("https://www.quandl.com/api/v3/datasets/OPEC/"+ this.stockName +".json/");
//    var stockData = stockAPI.get({start_date:this.startDate , end_date :this.endDate, api_key:'JNxtxN6Co3ayb6TZThzq'});
//    console.log(stockData);
    
//    var deferred = $q.defer();
//    stockData.$promise.then(function(result){
//        console.log(result);
//        var resultArr = [];
//        var dateArr =[];
//        var priceArr = [];
//        
//        for(var i in result.dataset.data){
//            dateArr[i] = result.dataset.data[i][0];
//            priceArr[i] = result.dataset.data[i][1];
//        }
//        
//        resultArr.push(dateArr, priceArr);
//        
//        deferred.resolve(resultArr);
//    }, function(err){
//        console.log('Error');
//    });
//    this.res = deferred.promise;
});


//Controllers
stockApp.controller('datesController',[ '$scope','stockService',function($scope,stockService){
    $scope.stockName = stockService.stockName;
    
    $scope.$watch('stockName',function(){
        stockService.stockName = $scope.stockName;
    });
   
}]);
    
//details
stockApp.controller('detailController',['$scope','$resource', 'stockService', function($scope,$resource,stockService){
   
//    $scope.startDate = stockService.startDate;
//    $scope.endDate = stockService.endDate;
//    console.log($scope.startDate);
//    $scope.stockAPI  = $resource("https://www.quandl.com/api/v3/datasets/OPEC/ORB.json/");
    
    $scope.stockName = stockService.stockName;
    console.log($scope.stockName);
    $scope.stockDataAll = stockService.info($scope.stockName);
    
    var stockData = stockService.res;
    stockData.then(function(data){
        $scope.prices = data[1];
        $scope.dates = data[0];
        
            Highcharts.chart('container', {
      title: {
        text: 'Stock Prices'
      },

      xAxis: {
        categories: $scope.dates
      },

      series: [{
        data: $scope.prices
      }]
    });
    }, function(err){
       console.log('Error'); 
    });    
    
    
}]);
