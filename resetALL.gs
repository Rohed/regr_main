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
  var orders = base.getData('Orders');
  Object.keys(orders).map(function(item){
    orders[item].final_status = 0;
    orders[item].premixed = 0;
    orders[item].premixedSerum = 0;
    orders[item].premixedStimulant = 0;
  })
  base.updateData('Orders',orders);
  base.removeData('Production');
  base.removeData('Printing');
  base.removeData('Labelling');
  base.removeData('Packaging');
}