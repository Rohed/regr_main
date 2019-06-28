function CheckPremixed(data) {
try{
    var USAGE ={};
    var suffix = data.batch.substr(-1);
    var LOGARR = [];
    if(! data.used){
    data.used=new Array();
    }
    var order= base.getData('Orders/' + data.batch);
    var premixSerum = getPremixSKU(data,'Serum');
    var premixStimulant = getPremixSKU(data,'Stimulant');
    
  
      toProduction(data);
      USAGE.Caps = {
        sku:data.lidSKU,
        name:data.lid,
        qty:  data.bottles,
      };
      LOGARR.push(['Sent to Production:', data.bottles]);
      data.used.push(['Lids/', data.lidSKU,data.bottles]);
      var neg = fromRunningtoReserved('Lids/' + data.lidSKU, data.bottles);
      LOGARR.push([data.lidSKU, data.bottles]);
      if (neg<0) {
        LOGARR = LOGARR.concat(returnData(data,neg))
        return {LogData:LOGARR,USAGE:USAGE};
      }
      
      USAGE.Bottles = {
        sku:data.botSKU,
        name:data.btype,
        qty:  data.bottles,
      };
      data.used.push(['BottleTypes/', data.botSKU,data.bottles]);
      var neg = fromRunningtoReserved('BottleTypes/' + data.botSKU, data.bottles);
      LOGARR.push([data.botSKU, data.bottles]);
      if (neg<0) {
        LOGARR = LOGARR.concat(returnData(data,neg))
        return {LogData:LOGARR,USAGE:USAGE};
      }
    
     USAGE.Tubes = {
        sku:data.tubeSKU,
        name:data.tubeType,
        qty:  data.bottles,
      };
      data.used.push(['BottleTypes/', data.tubeSKU,data.bottles]);
      var neg = fromRunningtoReserved('BottleTypes/' + data.tubeSKU, data.bottles);
      LOGARR.push([data.tubeSKU, data.bottles]);
      if (neg<0) {
        LOGARR = LOGARR.concat(returnData(data,neg))
        return {LogData:LOGARR,USAGE:USAGE};
      }
      USAGE.Production={
        Serum:1000 * data.QTY,
      };
      
    
  
          if (data.usecomb) {
          USAGE.combs = data.combs;
          data.used.push(['Misc/COMBWHITE', '', data.combs]);
          LOGARR.push(['COMBWHITE:', data.combs]);
          var neg = fromRunningtoReserved("Misc/COMBWHITE", data.combs);
          if (neg<0) {
            LOGARR = LOGARR.concat(returnData(data,neg))
            return {LogData:LOGARR,USAGE:USAGE};
          }
          
          
        }
  
  
  
    var premixstock = base.getData("PremixesTypes/" + premixSerum);
    var pom1 = premixstock.Reserved;
   
    if(premixstock.Running===undefined||premixstock.Running<0){premixstock.Running=0;}
    var helper = premixstock.Running - data.QTY;
    if (helper == 0) {
      var dat3 = {
        premixedSerum: premixstock.Running,
        premixed:premixstock.Running
      }
      premixstock.Running = 0;
      premixstock.Reserved = pom1 + data.QTY;
      
      USAGE.PremixSerum = {
        sku:premixSerum,
        name:premixstock.name,
        qty:  data.QTY,
      };
    
        LOGARR.push(['Premix:', dat3.premixed]);
      
     
        base.updateData('Orders/' + data.batch, dat3)
        base.updateData('PremixesTypes/' + premixSerum, premixstock);
        



    } else if (helper > 0) {
    
      var dat3 = {
        premixedSerum: data.QTY,
        premixed:data.QTY
      }
      premixstock.Running = helper;
      premixstock.Reserved = pom1 + data.QTY;
      USAGE.PremixSerum = {
        sku:premixSerum,
        name:premixstock.name,
        qty:  data.QTY,
      };

      
      LOGARR.push(['Premix:', data.QTY]);
     
      base.updateData('PremixesTypes/' + premixSerum, premixstock);
      base.updateData('Orders/' + data.batch, dat3);
      


    } else {
  
      var dat1 = {
        final_status: 0,
        runtime: "",
        premixed : 0, 
        premixedSerum : 0,
        premixedStimulant : 0,
        backtubed : 0,
      }
      
      base.updateData('Orders/' + data.batch, dat1); 
      
        USAGE.PremixSerum = {
        sku:premixSerum,
        name:premixstock.name,
        qty:  premixstock.Running,
      };
      data.used.push(['PremixesTypes/', premixSerum, 0]);
      LOGARR.push(['Premix:', 0]);
      
      LOGARR = LOGARR.concat(returnData(data, 0));

    }

  
      var order= base.getData('Orders/' + data.batch);
  
    var premixstock = base.getData("PremixesTypes/" + premixStimulant);
    var pom1 = premixstock.Reserved;
   
    if(premixstock.Running===undefined||premixstock.Running<0){premixstock.Running=0;}
    var helper = premixstock.Running - data.QTY;
    if (helper == 0) {
      var dat3 = {
        premixedStimulant: premixstock.Running
        
      }
      premixstock.Running = 0;
      premixstock.Reserved = pom1 + data.QTY;
      
      USAGE.PremixStimulant = {
        sku:premixStimulant,
        name:premixstock.name,
        qty:  data.QTY,
      };
    
        LOGARR.push(['Premix:', dat3.premixed]);
        if (dat3.premixed === undefined) {
            dat3.premixed = 0;
        }
        if(order.premixedSerum){
        dat3.premixed=dat3.premixedStimulant+order.premixedSerum;
        }
        base.updateData('Orders/' + data.batch, dat3)
        base.updateData('PremixesTypes/' + premixStimulant, premixstock);
        



    } else if (helper > 0) {
    
      var dat3 = {
        premixedStimulant: data.QTY
        
      }
      premixstock.Running = helper;
      premixstock.Reserved = pom1 + data.QTY;
      USAGE.PremixStimulant = {
        sku:premixStimulant,
        name:premixstock.name,
        qty:  data.QTY,
      };

      
      LOGARR.push(['Premix:', data.QTY]);
      if (dat3.premixed === undefined) {
        dat3.premixed = 0;
      }
      if(order.premixed){
        dat3.premixed=dat3.premixedStimulant+order.premixedSerum;
      }
      base.updateData('PremixesTypes/' + premixStimulant, premixstock);
      base.updateData('Orders/' + data.batch, dat3);
  

    } else {
  
      var dat1 = {
        final_status: 0,
        runtime: "",
         premixed : 0, 
        premixedSerum : 0,
        premixedStimulant : 0,
        backtubed : 0,
      }
      
      base.updateData('Orders/' + data.batch, dat1); 
      
        USAGE.PremixStimulant = {
        sku:premixStimulant,
        name:premixstock.name,
        qty:  premixstock.Running,
      };
      data.used.push(['PremixesTypes/', premixStimulant, 0]);
      LOGARR.push(['Premix:', 0]);
      
      LOGARR = LOGARR.concat(returnData(data, 0));

    }
     return {LogData:LOGARR,USAGE:USAGE};
}catch(e){
  var dat1 = {
    final_status: 0,
    runtime: "", 
    premixed : 0, 
     premixedSerum : 0,
        premixedStimulant : 0,
    backtubed : 0,
  }
  
  base.updateData('Orders/' + data.batch, dat1);
  LOGARR = LOGARR.concat(returnData(data, 0));
  LOGARR.push(['FAILED', e.message]);
  return {LogData:LOGARR,USAGE:USAGE};
  
}
  
}

function returnData(data,neg) {
    var LOGARR = [];
    for (var i = 0; i < data.used.length; i++) {
    try{
        fromReservedtoRunning(data.used[i][0] + data.used[i][1], data.used[i][2]);
        LOGARR.push(['To Running: ' + data.used[i][0] + data.used[i][1], data.used[i][2]]);
      }catch(e){
      
        LOGARR.push(['To Running Failed: ' + data.used[i][0] + data.used[i][1], data.used[i][2]]);
      }
    }
      var dat = {
        wentNegative: true, 
        premixed : 0, 
        backtubed : 0,
      }

    base.updateData('Orders/' + data.batch, dat);
    var sheets2 = ['Production', 'Printing', 'Labelling', 'Packaging', 'Shipping'];

    for (var i = 0; i < sheets2.length; i++) {
        try{
        base.removeData(sheets2[i] + '/' + data.batch);
        }catch(e){
          
          LOGARR.push(['Removing From Tab Failed: ', sheets2[i] + '/' + data.batch]);
        }
    }
    try{
    var name = base.getData(data.used[data.used.length-1][0] + data.used[data.used.length-1][1]+'/name');
    }catch(e){
    var name ='none';
    }
    LOGARR.push(['WENT NEGATIVE', Math.abs(neg)+ ' - '+ data.used[data.used.length-1][0] + data.used[data.used.length-1][1]+' - '+name ])

    return LOGARR;
}

function returnData2(data,neg) {
    var LOGARR = [];
    for (var i = 0; i < data.length; i++) {
        fromReservedtoRunning(data[i][0] + data[i][1], data[i][2]);
        LOGARR.push(['To Running: ' + data[i][0] + data[i][1], data[i][2]]);
    }
       var name = base.getData(data.used[data.used.length-1][0] + data.used[data.used.length-1][1]+'/name');

    LOGARR.push(['WENT NEGATIVE', Math.abs(neg)+' - '+ data.used[data.used.length-1][0] + data.used[data.used.length-1][1]+' - '+name])

    return LOGARR;
}