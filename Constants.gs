var sheets=['MixingTeam','Production','Printing','Labelling','Packaging','Shipping'];
var QTYSHEETS=['Misc','Packages','Flavours','Labels','Lids','Boxes'];

var RESTORE_PASSWORD = "123";
var PASSWORD='PASSWORD';
var SLSHEETPASSWORD="SLSHEET";
var BRANDED_STOCK_SUFFIX='B';




function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}
function JSONtoARR(data) {
  
  
  if (data) {
    
    if(Array.isArray(data)){
      data=data.filter(function(item){
        return item !== null;
      });
      
      return data;
    }else{
      
      var result = Object.keys(data).map(function(key) {
      
        return data[key];
      });
          result=result.filter(function(item){
        return item !== null;
      });
      return result;
      
    }
  } else {
    return [];
  }
  
}

function getBrandName(data){

  return data.productcode;
  
}


function getPremixSKU(data,type){
  var dat=base.getData('References/ProductCodes/'+data.productcode);
  
  generateForSinglePremix2(dat['premixSKU'+type], dat['premixdescr'+type]);
  return dat['premixSKU'+type];
  
}



function getBrandDropdown(){
var data=base.getData('Brands');

return JSONtoARR(data).sort(sortSTRINGLH('name'));//.sort(superSort1('name'));
}



function getCustomerDropdown(){

var data=JSONtoARR(base.getData('Customers')).sort(sortSTRINGLH('name'));
return data;//.sort(superSort1('name'));



}


function getPackagingDropdown(){

var data=JSONtoARR(base.getData('Packages'));


return data.filter(function(item){return item.name }).sort(sortSTRINGLH('name'));





}


function getLidDropdown(){
var data=JSONtoARR(base.getData('Lids')).sort(sortSTRINGLH('name'));
return data;//.sort(superSort1('name'));

}


function getLidDropdown2(){
var data=JSONtoARR(base.getData('Lids')).sort(sortSTRINGLH('name'));
return data;//.sort(superSort1('name'));
}
function getBottlesDropdown2(){

var data=JSONtoARR(base.getData('BottleTypes')).sort(sortSTRINGLH('name'));
return data;//.sort(superSort1('name'));

}
function getBottlesDropdown(){

var data=JSONtoARR(base.getData('BottleTypes')).sort(sortSTRINGLH('name'));
return data;//.sort(superSort1('name'));
}


function getFlavourDropdown(){


var data=base.getData('Flavours');
if (data) {
        var result = JSONtoARR(data).sort(sortSTRINGLH('name'));

      
return result;

}else {return [];}







}

function getRecipeDropdown(){


var data=base.getData('Recipes');
  if (data) {
    var result = JSONtoARR(data).sort(sortSTRINGLH('name'));
    var retArr = [];
    for (var i = 0; i < result.length; i++) {
      
      retArr.push([result[i].name,result[i].id]);
      
      
    }
    
  }

return retArr;




}