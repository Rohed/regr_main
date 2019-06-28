function testPartial() {
    subPartial('911000', 325, 'Production')
}

function subPartial(batch, newBottles, sheet) {
    try {
        
        newBottles = parseInt(newBottles, 10);
      var suffix = batch.substr(-1);
      
      var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;
      if(for_branded_stock){
        var roundups = base.getData('Roundups');
        if(newBottles%roundups.bottles != 0 ){
          var msg = "Error: Please adjust the amount of bottles for "+batch+" to fit the batch of "+roundups.batch+"L \n";
          msg += 'Bottles should be a multiple of '+roundups.bottles;
          return msg;
          
        }
      }
        var LOGDATA = {
            status: true,
            msg: '',
            action: 'Partial Order',
            batch: batch,
            page: sheet,
            user: Session.getActiveUser().getEmail(),
            data: new Array()
        };
        LOGDATA.data.push(['New Bottles:', newBottles]);
        var item = base.getData(sheet + '/' + batch);
        if (sheet == 'Production') {
            LOGDATA.data = LOGDATA.data.concat(fromProduction(batch, newBottles));
        } else {
            LOGDATA.data = LOGDATA.data.concat(fromPackaging(batch, newBottles));
        }
        LOGDATA.data = LOGDATA.data.concat(updateOrder(batch, newBottles, sheet, item));
        logItem(LOGDATA);
      return 'Success';
    } catch (e) {
      LOGDATA.status = false;
      LOGDATA.msg = " Failed. " + e.message;
      logItem(LOGDATA);
      return " Failed. " + e.message;
    }
}

function fromProduction(batch, bottles) {
   var roundups = base.getData('Roundups');
    var USAGE = {};
    var LOGARR = [];
    var suffix = batch.substr(-1);

    var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;
    var order = base.getData('Orders/' + batch);
    var prodData = base.getData('Production/' + batch);
    var ORIGBOTTLES = prodData.bottles;
    var removeFromProduction = ORIGBOTTLES - bottles;
  var premixedSerum = order.premixedSerum;
  var premixedStimulant= order.premixedStimulant;
  var premixSerum = getPremixSKU(order,'Serum');
  var premixStimulant = getPremixSKU(order,'Stimulant');
  
    var volume = bottles * order.fill / 1000;
    if(for_branded_stock){
   volume = Math.ceil(volume / roundups.batch) * roundups.batch;
    }
    
    LOGARR.push(['Volume: ', volume]);
  
 
  
  
    LOGARR.push(['premixedSerum: ', premixedSerum]);
    var amount = 0;
    var helper = 0;
    var helper2 = 0;
    if (premixedSerum > 0) {
        if (premixedSerum > volume) {
            amount = volume;
            helper = volume;
            volume = 0;
            helper2 = order.premixedSerum - helper;
        } else {
            amount = premixedSerum;
            volume = volume - premixedSerum;
            helper = 0;
            helper2 = 0;
        }
    
            USAGE.Premix = {
                sku: premixSerum,
                qty: amount
            } 
            fromReservedtoRunning('PremixesTypes/' + premixSerum, amount);
        
        LOGARR.push(['amount: ', amount]);
        LOGARR.push(['premixedSerum: ', helper2]);
        var dat1 = {
            premixedSerum: helper2,
        }
        base.updateData('Orders/' + batch, dat1);
    }
    if ( volume > 0) {
        LOGARR.push(['Volume: ', volume]);
         PtoRunning(premixSerum, amount);
        
        base.updateData('Orders/' + batch, dat1);
    }
  
  
  var volume = bottles * order.fill / 1000;
  if(for_branded_stock){
    volume = Math.ceil(volume / roundups.batch) * roundups.batch;
  }
  LOGARR.push(['premixedStimulant: ', premixedStimulant]);
  var amount = 0;
  var helper = 0;
  var helper2 = 0;
    if (premixedStimulant > 0) {
        if (premixedStimulant > volume) {
            amount = volume;
            helper = volume;
            volume = 0;
            helper2 = order.premixedStimulant - helper;
        } else {
            amount = premixedStimulant;
            volume = volume - premixedStimulant;
            helper = 0;
            helper2 = 0;
        }
    
            USAGE.Premix = {
                sku: premixStimulant,
                qty: amount
            } 
            fromReservedtoRunning('PremixesTypes/' + premixStimulant, amount);
        
        LOGARR.push(['amount: ', amount]);
        LOGARR.push(['premixedStimulant: ', helper2]);
        var dat1 = {
            premixedStimulant: helper2,
        }
        base.updateData('Orders/' + batch, dat1);
    }
    if ( volume > 0) {
        LOGARR.push(['Volume: ', volume]);
         PtoRunning(premixStimulant, amount);
        
        base.updateData('Orders/' + batch, dat1);
    }
  
  
    LOGARR.push(['Removed bottles:', removeFromProduction]);
    USAGE.Caps = {
        sku: prodData.lidSKU,
        qty: removeFromProduction
    }
    removeFromReserved('Lids/' + prodData.lidSKU, removeFromProduction);
    LOGARR.push(['To Running: ' + prodData.lidSKU, removeFromProduction]);
    USAGE.Bottles = {
        sku: prodData.botSKU,
        qty: removeFromProduction
    }
    removeFromReserved('BottleTypes/' + prodData.botSKU, removeFromProduction);
    LOGARR.push(['To Running: ' + prodData.botSKU, removeFromProduction]);
  
  USAGE.packs = {
    sku: prodData.packsKU,
    qty: removeFromProduction
  }
  removeFromReserved('BottleTypes/' + prodData.packsKU, removeFromProduction);
    LOGARR.push(['To Running: ' + prodData.packsKU, removeFromProduction]);

    //CHECK PRINTING
    var printData = base.getData('Printing/' + batch);
    var labelingData = base.getData('Labelling/' + batch);
    var removedFromPrinting = true;
    if (printData && !labelingData) {
        if (printData.movedtoNext == 0) {
            var label = order.botlabelsku;
            var packData = getPackagingData(printData.packagingType, removeFromProduction, order.boxname.sku)
            var packink = packData.ink;
            var tube = packData.botperPack;
            var boxname = order.boxname.sku;
            var packs = removeFromProduction / tube;
            var box = packs / packData.divTubesForBox;
            printData.numLabelsBottles = printData.numLabelsBottles - removeFromProduction;
            printData.numLabelspacks = printData.numLabelspacks - (removeFromProduction / tube);
            printData.bottles = printData.bottles - removeFromProduction;
            LOGARR.push(['New in Printing: ', printData.bottles]);
            base.updateData('Printing/' + batch, printData);
            if (!isFinite(box)) {
                box = 0;
            }
            if (tube) {
                USAGE.Packages = {
                    sku: printData.packagingType.sku,
                    qty: packs
                }
                removeFromReserved('Packages/' + printData.packagingType.sku, packs);
                LOGARR.push(['To Running: ' + printData.packagingType.sku, packs]);
                if (printData.packlabelsku != "" && printData.packlabelsku != undefined) {
                    if (order.ppp) {
                        USAGE.PrePackLabel = {
                            sku: printData.packlabelsku,
                            qty: packs
                        };
                    } else {
                        USAGE.PackLabel = {
                            sku: printData.packlabelsku,
                            qty: packs
                        };
                    }
                    if (printData.packlabelsku != "" && printData.packlabelsku != undefined) {
                        removeFromReserved('Labels/' + printData.packlabelsku, packs);
                        LOGARR.push(['To Running: ' + printData.packlabelsku, packs]);
                    }
                }
            }
            var ink = 0;
            if (!order.ppb) {
                ink += removeFromProduction * 0.001;
            }
            if (!order.ppp) {
                ink += packink;
            }
            USAGE.ink = {
                qty: ink
            }
            removeFromReserved("Misc/printing ink", ink);
            LOGARR.push(['To Running: Ink', ink]);
            USAGE.BottleLabel = {
                sku: label,
                qty: removeFromProduction
            }
            removeFromReserved('Labels/' + label, removeFromProduction);
            LOGARR.push(['To Running: ' + label, removeFromProduction]);
        }
    } else {
        removedFromPrinting = false;
        var packData = getPackagingData(printData.packagingType, removeFromProduction, order.boxname.sku)
        var packink = packData.ink;
        var ink = 0;
        if (!order.ppb) {
            ink += removeFromProduction * 0.001;
        }
        if (!order.ppp) {
            ink += packink;
        }
        USAGE.ink = {
            qty: ink
        }
        removeFromReserved("Misc/printing ink", ink);
        LOGARR.push(['To Running: Ink', ink]);
    }
    //CHECK LABELLING
    var removedFromLabelling = true;
    if (labelingData) {
        if (!removedFromPrinting) {
            if (labelingData.movedtoNext == 0) {
                var label = order.botlabelsku;
                labelingData.bottles = labelingData.bottles - removeFromProduction;
                base.updateData('Labelling/' + batch, labelingData);
                LOGARR.push(['New in Labelling: ', labelingData.bottles]);
                var packData = getPackagingData(labelingData.packagingType, removeFromProduction, order.boxname.sku)
                var packink = packData.ink;
                var tube = packData.botperPack;
                var boxname = order.boxname.sku;
                var packs = removeFromProduction / tube;
                var box = packs / packData.divTubesForBox;
                if (!isFinite(box)) {
                    box = 0;
                }
                if (tube) {
                    USAGE.Packages = {
                        sku: labelingData.packagingType.sku,
                        qty: packs
                    }
                    removeFromReserved('Packages/' + labelingData.packagingType.sku, packs);
                    LOGARR.push(['To Running: ' + labelingData.packagingType.sku, packs]);
                    if (labelingData.packlabelsku != "" && labelingData.packlabelsku != undefined) {
                        if (order.ppp) {
                            USAGE.PrePackLabel = {
                                sku: labelingData.packlabelsku,
                                qty: packs
                            };
                        } else {
                            USAGE.PackLabel = {
                                sku: labelingData.packlabelsku,
                                qty: packs
                            };
                        }
                        if (labelingData.packlabelsku != "" && labelingData.packlabelsku != undefined) {
                            removeFromReserved('Labels/' + labelingData.packlabelsku, packs);
                            LOGARR.push(['To Running: ' + labelingData.packlabelsku, packs]);
                        }
                    }
                }
                USAGE.BottleLabel = {
                    sku: label,
                    qty: removeFromProduction
                }
                removeFromReserved('Labels/' + label, removeFromProduction);
                LOGARR.push(['To Running: ' + label, removeFromProduction]);
            }
        } else {
            removedFromLabelling = false;
        }
    }
    //CHECK PACKAGING
    var packagingData = base.getData('Packaging/' + batch);
    if (packagingData) {
        if (packagingData.movedtoNext == 0) {
            var origbottles = packagingData.bottles;
            packagingData.bottles = origbottles - removeFromProduction;
            LOGARR.push(['New in Packaging: ', packagingData.bottles]);
            base.updateData('Packaging/' + batch, packagingData);
            var packData = getPackagingData(packagingData.packagingType, removeFromProduction, order.boxname.sku)
            var packink = packData.ink;
            var tube = packData.botperPack;
            var boxname = order.boxname.sku;
            var packs = removeFromProduction / tube;
            var box = packs / packData.divTubesForBox;
            if (!isFinite(box)) {
                box = 0;
            }
            if (!for_branded_stock) {
                if (order.packagingType && !removedFromLabelling) {
                    USAGE.Packages = {
                        sku: order.packagingType.sku,
                        qty: packs
                    }
                    LOGARR.push(['To Running: ' + order.packagingType.sku, packs]);
                    removeFromReserved('Packages/' + order.packagingType.sku, packs);
                }
                if (boxname) {
                    USAGE.Boxes = {
                        sku: boxname,
                        qty: box
                    }
                    LOGARR.push(['To Running: ' + boxname, box]);
                    removeFromReserved('Boxes/' + boxname, box);
                }
            } else {
                if (tube && !removedFromLabelling) {
                    USAGE.Packages = {
                        sku: order.packagingType.sku,
                        qty: packs
                    }
                    LOGARR.push(['To Running: ' + packagingData.packagingType.sku, packs]);
                    removeFromReserved('Packages/' + packagingData.packagingType.sku, packs);
                }
            }
           
          if(packagingData.usecomb && for_branded_stock){
            USAGE.Misc = {
              sku: 'COMBWHITE',
              qty: removeFromProduction
            }
            
            removeFromReserved('Misc/COMBWHITE', removeFromProduction);
            LOGARR.push(['To Running: COMBWHITE', removeFromProduction]);
          }
        }
    }
    prodData.bottles = prodData.bottles - removeFromProduction;
    LOGARR.push(['New in Production: ', prodData.bottles]);
    base.updateData('Production/' + batch, prodData);
    var usageArr = convertUsageToArr(order, USAGE);
    LogPOTransaction(usageArr);
    return LOGARR;
}

function fromPackaging(batch, bottles) {
    var USAGE = {};
    var LOGARR = [];
    var suffix = batch.substr(-1);
    var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;
    var order = base.getData('Orders/' + batch);
    var packagingData = base.getData('Packaging/' + batch);
    var ORIGBOTTLES = packagingData.bottles;
    var removeFromProduction = ORIGBOTTLES - bottles;
    var packagingData = base.getData('Packaging/' + batch);
    if (packagingData) {
        if (packagingData.movedtoNext == 0) {
            var origbottles = packagingData.bottles;
            packagingData.bottles = origbottles - removeFromProduction;
            LOGARR.push(['New in Packaging: ', packagingData.bottles]);
            base.updateData('Packaging/' + batch, packagingData);
            var packData = getPackagingData(packagingData.packagingType.sku, removeFromProduction, order.boxname.sku)
            var packink = packData.ink;
            var tube = packData.botperPack;
            var boxname = order.boxname.sku;
            var packs = removeFromProduction / tube;
            var box = packs / packData.divTubesForBox;
            if (!isFinite(box)) {
                box = 0;
            }
            if (!for_branded_stock) {
                if (order.packagingType.sku) {
                    USAGE.Packages = {
                        sku: order.packagingType.sku,
                        qty: packs
                    }
                    LOGARR.push(['To Running: ' + order.packagingType.sku, packs]);
                    removeFromReserved('Packages/' + order.packagingType.sku, packs);
                }
                if (boxname) {
                    USAGE.Boxes = {
                        sku: boxname,
                        qty: box
                    }
                    LOGARR.push(['To Running: ' + boxname, box]);
                    removeFromReserved('Boxes/' + boxname, box);
                }
            } else {
                if (tube != 0) {
                    USAGE.Packages = {
                        sku: order.packagingType.sku,
                        qty: packs
                    }
                    LOGARR.push(['To Running: ' + packagingData.packagingType.sku, packs]);
                    removeFromReserved('Packages/' + packagingData.packagingType.sku, packs);
                }
            }
          if(packagingData.usecomb && for_branded_stock){
            USAGE.Misc = {
              sku: 'COMBWHITE',
              qty: removeFromProduction
            }
            
            removeFromReserved('Misc/COMBWHITE', removeFromProduction);
            LOGARR.push(['To Running: COMBWHITE', removeFromProduction]);
          }
        }
    }
    var usageArr = convertUsageToArr(order, USAGE);
    LogPOTransaction(usageArr);
    return LOGARR;
}

function updateOrder(batch, bottles, sheet, originalItem) {
    var LOGARR = [];
    var order = base.getData('Orders/' + batch);
    if (sheet == 'Production') {
        var dat1 = {
            partialProduction: bottles,
            removedProduction: originalItem.bottles - bottles
        };
        LOGARR.push(['Partial Production:', bottles]);
        LOGARR.push(['Removed:', originalItem.bottles - bottles]);
    } else {
        var dat1 = {
            partialPackaging: bottles,
            removedPackaging: originalItem.bottles - bottles
        };
        LOGARR.push(['Partial Packaging:', bottles]);
        LOGARR.push(['Removed:', originalItem.bottles]);
    }
    base.updateData('Orders/' + batch, dat1);
    var leftover = originalItem.bottles - bottles;
    var item = base.getData(sheet + '/' + batch);
    //NEWORDER
  var object = {
    fill: order.fill,
    productcode: order.productcode,
    productdescription: order.productdescription,
    batch: batch + 'PO',
    orderID: order.orderID,
    orderdate: parseInt(order.orderdate, 10),
    priority: order.priority,
    customer: order.customer,
    customerSKU: order.customerSKU,
    brand: order.brand,
    brandSKU: order.brandSKU,
    'bottles': leftover,
    'combs':leftover,
    usecomb:order.usecomb,
    btype: order.btype,
    lid: order.lid,
    tubeType:order.tubeType,
    packsKU: order.packsKU,
    serumBatchCode: order.serumBatchCode,
    stimulantBatchCode: order.stimulantBatchCode,
    botSKU: order.botSKU,
    lidSKU: order.lidSKU,
    packagingType: order.packagingType,
    boxname: order.boxname,
    ppp: order.ppp,
    ppb: order.ppb,
  };
    var exists = base.getData('Orders/' + object.batch);
    if (exists) {
        object.batch += 'PK';
        var exists = base.getData('Orders/' + object.batch);
        if (exists) {
            object.batch += 'PO';
        }
    }
    LOGARR.push(['New Order Batch:', object.batch]);
    saveOrder(object,false,true);
    return LOGARR;
}
//REVERSE DELETION
function TESTREVERSEINFO() {
    getBatchInfo(['915361B'],'reverse');
}

function getBatchInfo(batches, key) {
    var suffixes = ['PO', 'PK', 'OV'];
    var sheets = ['Orders', 'Production', 'Printing', 'Labelling', 'Packaging'];
    //  var sheetStatus=['final_status','mixing_status','printing_status','labelling_status','packaging_status'];
    var orders = base.getData('Orders');
    var topush = [];
    for (var j = 0; j < batches.length; j++) {
        for (var s = 0; s < suffixes.length; s++) {
            if (batches.indexOf(batches[j] + suffixes[s]) == -1) {
                var exists = orders[batches[j] + suffixes[s]];
                if (exists) {
                    topush.push(batches[j] + suffixes[s])
                }
            }
        }
    }
    batches = batches.concat(topush);
    var rett = [];
    for (var i = 0; i < sheets.length; i++) {
        var raw = base.getData(sheets[i]) || {};
        // var list=JSONtoARR(raw);
        for (var j = 0; j < batches.length; j++) {
            var suf2 = batches[j].substr(-2);
            if (suf2 == 'RU') {
                continue;
            }
            var existsinRett = rett.getIndex(batches[j]);
            if (existsinRett == -1) {
            Logger.log('here1')
                existsinRett = rett.length;
                if (key == 'deleteandreverse' || key == 'reverse') {
                 Logger.log('here2')
                    rett.push([batches[j]]);
                } else if (key == 'statuscheck') {
                    var shippingItem = base.getData('Shipping/' + batches[j]);
                    if (shippingItem) {
                        rett.push([batches[j], orders[batches[j]].orderID, orders[batches[j]].runtime, orders[batches[j]].customer,
                            shippingItem.dateshipped, shippingItem.SHIPPINGCODE
                        ]);
                    } else {
                        rett.push([batches[j], orders[batches[j]].orderID, orders[batches[j]].runtime, orders[batches[j]].customer,
                            '', ''
                        ]);
                    }
                }
            }
            var existsinRaw = raw[batches[j]];
            if (existsinRaw) {
                if (existsinRaw.final_status == 0 || existsinRaw.final_status == null) {
                    existsinRaw.final_status = 'Not Run';
                }
                if (existsinRaw.movedtoNext == 'Busy') {
                    existsinRaw.final_status = 'Busy';
                }
                Logger.log('existsinRett '+existsinRett)
                 Logger.log(rett)
                rett[existsinRett].push([existsinRaw.final_status, existsinRaw.movedtoNext]);
            } else {
                rett[existsinRett].push(['N/A', false]);
            }
        } //END OF BATCHES
    } //END OF SHEETS
    return [rett, key];
}

function testDELANREV() {
//var batchInfo = getBatchInfo(['918709'],'deleteandreverse')[0];
//base.updateData('batchInfo',{'info':JSON.stringify(batchInfo)});
var batchInfo = getBatchInfo(['915361B'],'reverse')
Logger.log(batchInfo);
deleteAndReverse(batchInfo[0], 'reverse')
}

function deleteAndReverse(data, key) {
    var sheets = ['Packaging', 'Labelling', 'Printing', 'Production', 'Orders'];
    //  var sheetStatus=['final_status','mixing_status','printing_status','labelling_status','packaging_status'];
    for (var i = 0; i < sheets.length; i++) {
        var raw = base.getData(sheets[i]) || {};
        for (var j = 0; j < data.length; j++) {
          var item = data[j];
          
          var sheetItem = raw[data[j][0]];
          
            reverseLineItemMove(item, base.getData('Orders/' + data[j][0]), sheetItem, sheets[i], key);
        }
    }
    var removed = [];
    for (var j = 0; j < data.length; j++) {
        removed.push(data[j][0]);
    }
    if (key == 'delete') {
        return 'Removed: ' + removed.join(', ');
    } else {
        return 'Reversed: ' + removed.join(', ');
    }
}

function reverseLineItemMove(sheetItem, order, item, sheet, key) {
    Logger.log(item);
    Logger.log(order);
    Logger.log(sheetItem);
    //   var suffix = sheetItem[0].replace(/[^a-zA-Z]+/g, '');
    if (sheet == 'Packaging' && sheetItem[5][0] == 'Not Run') {
        var brandname = getBrandName(order);
        var packData = getPackagingData(item.packagingType, item.bottles, order.boxname.sku)
        var packink = packData.ink;
        var pack = packData.botperPack;
        var boxname = order.boxname.sku;
        var suffix = order.batch.substr(-1);
        var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;
        var packs = item.bottles / pack;
        var tominusP = order.premixed;
      var tominBPack = order.backtubed;
      if (pack != 0) { 
        if (for_branded_stock) {
          fromReservedtoRunning('Packages/' + item.packagingType.sku, packs - tominBPack);
        } else {
          var box = packs / packData.divTubesForBox;
          if (boxname) {
            fromReservedtoRunning('Boxes/' + boxname, box);
          }
          fromReservedtoRunning('BrandedTypes/' + brandname, tominBPack);
        }
        
      }else {
        //NO PACKAGING
        if (for_branded_stock) {
          removeFromRunning('BrandedTypes/' + brandname, item.bottles);
        } else {
          var box = 0;
          if (boxname) {
            fromCompletedtoRunning('Boxes/' + boxname, box);
          } 
        }
        
      }
      
      if(item.usecomb && for_branded_stock){
         fromReservedtoRunning('Misc/COMBWHITE', item.combs);
 
      }
    } else if (sheet == 'Packaging' && sheetItem[5][0] == 'Completed') {
        var brandname = getBrandName(order, false);
        var packData = getPackagingData(item.packagingType, item.bottles, order.boxname.sku)
        var packink = packData.ink;
        var pack = packData.botperPack;
        var boxname = order.boxname.sku;
        var suffix = order.batch.substr(-1);
        var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;
        var packs = item.bottles / pack; 
        var tominBPack = order.backtubed;
        if (pack != 0) {
          if (for_branded_stock) {
            fromCompletedtoRunning('Packages/' + item.packagingType.sku, packs - tominBPack);
            removeFromRunning('BrandedTypes/' + brandname, packs);
          } else {
            var box = packs / packData.divTubesForBox;
            if (boxname) {
              fromCompletedtoRunning('Boxes/' + boxname, box);
            }
            fromCompletedtoRunning('BrandedTypes/' + brandname, tominBPack);
          }
          
        } else {
            //NO PACKAGING
            if (for_branded_stock) {
                removeFromRunning('BrandedTypes/' + brandname, item.bottles);
            } else {
                var box = 0;
                if (boxname) {
                    fromCompletedtoRunning('Boxes/' + boxname, box);
                }
               
            }
        }
      if(item.usecomb && for_branded_stock){
        fromCompletedtoRunning('Misc/COMBWHITE', item.combs);
        
      }
        //  base.removeData('Packaging/'+item[0]);
        ////END FOR PACKAGING
    } else if (sheet == 'Labelling' && sheetItem[4][0] == 'Not Run') {
        
        var origbots = order.bottles; 
        var tominusP = order.premixed; 
        var tominBPack = order.backtubed; 
        var botQ2 = item.bottles;
        var label = order.botlabelsku;
        var packData = getPackagingData(item.packagingType, item.bottles, order.boxname.sku)
        // var packlabel = packData.packlabel;
        var packink = packData.ink;
        var tube = packData.botperPack;
        var boxname = order.boxname.sku;
        var packs = botQ2 / tube;
        var box = packs / packData.divTubesForBox;
        if (tube) {
            if (item.packlabelsku != "" && item.packlabelsku != undefined) {
                fromReservedtoRunning('Labels/' + item.packlabelsku, packs);
            }
        }
        fromReservedtoRunning('Labels/' + label, item.bottles);
     

    } else if (sheet == 'Labelling' && sheetItem[4][0] == 'Completed') {
     
        var origbots = order.bottles;
        var tominusP = order.premixed; 
        var tominBPack = order.backtubed; 
        var botQ2 = item.bottles;
        var label = order.botlabelsku;
        var packData = getPackagingData(item.packagingType, item.bottles, order.boxname.sku)
        // var packlabel = packData.packlabel;
        var packink = packData.ink;
        var tube = packData.botperPack;
        var boxname = order.boxname.sku;
        var packs = botQ2 / tube;
        var box = packs / packData.divTubesForBox;
        if (tube) {
            if (item.packlabelsku != "" && item.packlabelsku != undefined) {
                fromCompletedtoRunning('Labels/' + item.packlabelsku, packs);
            }
        }
        fromCompletedtoRunning('Labels/' + label, item.bottles);
 
        //END FOR LABELLING
    } else if (sheet == 'Printing' && sheetItem[3][0] == 'Not Run') {
        var packData = getPackagingData(item.packagingType, item.bottles + order.branded, order.boxname.sku)
        //   var packlabel = packData.packlabel;
        var packink = packData.ink;
        var tube = packData.botperPack;
        var packs = item.bottles / tube;
        var ink = 0;
        if (!item.ppb) {
            ink = item.bottles * 0.001;
        }
        if (!item.ppp) {
            ink += packink;
        }
        fromReservedtoRunning("Misc/printing ink", ink);
 
    } else if (sheet == 'Printing' && sheetItem[3][0] == 'Completed') {
        var packData = getPackagingData(item.packagingType, item.bottles + order.branded, order.boxname.sku)
        //   var packlabel = packData.packlabel;
        var packink = packData.ink;
        var tube = packData.botperPack;
        var packs = item.bottles / tube;
        var ink = 0;
        if (!item.ppb) {
            ink = item.bottles * 0.001;
        }
        if (!item.ppp) {
            ink += packink;
        }
        fromCompletedtoRunning("Misc/printing ink", ink);
        //END OF PRINTING
    } else if (sheet == 'Production' && sheetItem[2][0] == 'Not Run') {
      fromReservedtoRunning('Lids/' + item.lidSKU, item.bottles);
      fromReservedtoRunning('BottleTypes/' + item.botSKU, item.bottles);
      fromReservedtoRunning('BottleTypes/' + item.tubeSKU, item.bottles);
      var premixSerum = getPremixSKU(order,'Serum');
      var premixStimulant = getPremixSKU(order,'Stimulant');
      var suffix = order.batch.substr(-1);
      
      var tominusP = order.premixed;
      
      if (tominusP > 0) {
        fromReservedtoRunning('PremixesTypes/' + premixSerum, order.premixedSerum);
        fromReservedtoRunning('PremixesTypes/' + premixStimulant, order.premixedStimulant);
      }
      
        if (item.hasoverprod) {
          var overprodvol = item.overprod * order.fill / 1000; 
          fromReservedtoRunning('PremixesTypes/' + premixSerum, overprodvol);
          fromReservedtoRunning('PremixesTypes/' + premixStimulant, overprodvol);
            //  UtoRunning(unbrand, item.overprod);
        }
    } else if (sheet == 'Production' && sheetItem[2][0] == 'Completed') {
      fromCompletedtoRunning('Lids/' + item.lidSKU, item.bottles);
      fromCompletedtoRunning('BottleTypes/' + item.botSKU, item.bottles);
      fromCompletedtoRunning('BottleTypes/' + item.tubeSKU, item.bottles);
        var premixSerum = getPremixSKU(order,'Serum');
      var premixStimulant = getPremixSKU(order,'Stimulant');
    
        var suffix = order.batch.substr(-1);
     
     
            var tominusP = order.premixed; 
            
      if (tominusP > 0) {
        fromCompletedtoRunning('PremixesTypes/' + premixSerum, order.premixedSerum);
        fromCompletedtoRunning('PremixesTypes/' + premixStimulant, order.premixedStimulant);
        
      }
       
      if (item.hasoverprod) {
        var overprodvol = item.overprod * order.fill / 1000; 
        fromCompletedtoRunning('PremixesTypes/' + premixSerum, overprodvol);
        fromCompletedtoRunning('PremixesTypes/' + premixStimulant, overprodvol);
      }
    } else if (sheet == 'Orders') {
  
   
        base.removeData('Production/' + sheetItem[0]);
        base.removeData('Printing/' + sheetItem[0]);
        base.removeData('Labelling/' + sheetItem[0]);
        base.removeData('Packaging/' + sheetItem[0]);
        base.removeData('Shipping/' + sheetItem[0]);
        if (key == 'delete') {
            LogDARTransaction(sheetItem[0]);
            base.removeData('Orders/' + sheetItem[0]);
        } else {
            var data = {
                final_status: 0,
                runtime: 0,
                started: 0,
            }
            data.removedProduction = 0
            data.partialProduction = 0;
            data.partialPackaging = 0;
            data.removedPackaging = 0
             data.premixedSerum = 0;
            data.premixedStimulant = 0
            data.saved = true; 
            data.premixed = 0; 
            data.backtubed = 0;
            data.production_status = 0;
            data.printing_status = 0;
            data.labeling_status = 0;
            data.packaging_status = 0;
            data.wentNegative = false;
            LogRTransaction(sheetItem[0]);
            base.updateData('Orders/' + sheetItem[0], data);
        }
    }
}