(function(){
    'use strict';
    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
    .directive('foundItems', FoundItems);

    function FoundItems(){
        var ddo = {
            templateUrl: 'foundItems.html',
            scope:{
                items: '<',
                onRemove: '&'
            },
            controller: FoundItemsControler,
            controllerAs: 'controller',
            bindToController: true
        };
        return ddo;
    }   

    function FoundItemsControler(){}
    //The function I don't know how aplicate, but without this fuction the program don't work
    
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService){
        var menu = this;
        menu.getItems = function(nameItem){
            var promise = MenuSearchService.getMenuItems(nameItem);
            promise.then(function(response){
                menu.itemFound = response;
                if(menu.itemFound.length == 0){
                    menu.message = "Nothing Found!";
                }else{
                    menu.message = "";
                }
                //console.log("Message: ", menu.message);
            });
        };

        menu.removeElement = function(index){
            MenuSearchService.removeElement(index);
        }
    }
    
    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath){
        var service = this;
        var foundItems = [];
        service.getMenuItems = function(nameItem){
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json"),
            })
            .then(function(result){
                var items_menu = result.data.menu_items;
                for(var i = 0; i < items_menu.length; i++){
                    //Comparative in aap.js Lecture31 function list.cookiesInList
                    if(nameItem != "" && items_menu[i].description.indexOf(nameItem.toLowerCase()) != -1){
                        foundItems.push(items_menu[i]);
                    }
                }
                //Validation items search.
                //console.log(foundItems); 
                return foundItems;
            });
        };
        service.removeElement = function(index){
            foundItems.splice(index, 1); //Dalete item of array
        };
    }

})();