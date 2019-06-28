function resetDatabase(){
 
  var QTY = ['Misc','Lids','BottleTypes','Packages','Labels','PremixesTypes','BrandedTypes']
 
  QTY.map(function(item){
    var data = base.getData(item);
    if(data){
    Object.keys(data).map(function(sku){
      data[sku].Running = 1000000;
      data[sku].Reserved = 0;
      data[sku].Completed = 0;
    })
    base.updateData(item,data);
    }
  });
  
 
}