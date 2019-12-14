function testprintsafety() {

    Logger.log(printSafetyReports(['RGMIX1384']))
}

function printSafetyReports(SELECTED) {

    var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
    var folder = DriveApp.getFolderById(SAFETYREPORTS.folder);
    var PC = base.getData('References/ProductCodes');
    var premixes = base.getData('PremixesTypes');
    var used = findTemplates(SELECTED, PC);
    var notFoundMSG = '';
    for (var i = 0; i < SELECTED.length; i++) {


        if (used[i] === false) {
            notFoundMSG += '<br> ' + SELECTED[i];
            continue;
        }
        var data = PC[used[i]];
        if (!data) {
            notFoundMSG += '<br> ' + SELECTED[i];
            continue;
        }

        var fileID = SAFETYREPORTS['0'];
        var create = DriveApp.getFileById(fileID).makeCopy(SELECTED[i] + ' ' + formattedDate + ' Safety Report', folder);
        var file = DocumentApp.openById(create.getId());
        file.replaceText('<<NAME>>', data.productdescription);
        file.replaceText('<<SKU>>', data.prod);
        //    file.getHeader().replaceText('<<NAME>>',data.name);
        //    file.getHeader().replaceText('<<SKU>>',data.sku);
        //   
    }

    var ret = 'Safety Reports generated in the Folder:<br> <a  target="_blank" href="' + folder.getUrl() + '">' + folder.getName() + '</a>';
    if (notFoundMSG) {
        ret += '<br> COULD NOT PRINT THESE ITEMS DUE TO A MISSING RECIPE OR TYPE OF TEMPLATE:' + notFoundMSG;
    }
    return ret;
}

function findTemplates(SELECTED, PC, premixes) {
    var PCList = JSONtoARR(PC);
    var arr = [];
    for (var i = 0; i < SELECTED.length; i++) {
        var found = false;

        for (var j = 0; j < PCList.length; j++) {

            if (PCList[j].premixSKUSerum == SELECTED[i] || PCList[j].premixSKUStimulant == SELECTED[i]) {
                found = true;
                arr.push(PCList[j].prod)
                break;
            }

        }

        if (!found) {
            arr.push(false);
        }
    }

    return arr;
}

function tesprint() {
    printProductionBatches(['1111B']);

}

function printProductionBatches(SELECTED) {
    Logger.log(SELECTED);


    var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
    var folder = DriveApp.getFolderById(BATCH_NOTES_FOLDER);

    for (var i = 0; i < SELECTED.length; i++) {

        var data = base.getData('Production/' + SELECTED[i]);
        if (!data) {
            continue;
        }
        var order = base.getData('Orders/' + SELECTED[i]);

        var create = DriveApp.getFileById(PRODUCTION_FILE_ID).makeCopy(SELECTED[i], folder);
        var file = DocumentApp.openById(create.getId());
        var PC = base.getData("References/ProductCodes/" + order.productcode);
        file.replaceText('«BatchNO»', data.batch);
        file.replaceText('«Order_Number»', data.orderID);
        file.replaceText('«Customer_Name»', data.customer);


        file.replaceText('«Fill_Date»', formatDateDisplay2(data.CompletionDate));
        file.replaceText('«Fill_Date»', formatDateDisplay2(data.CompletionDate));
        file.replaceText('«Fill_Date»', formatDateDisplay2(data.CompletionDate));
        file.replaceText('«Fill_Date»', formatDateDisplay2(data.CompletionDate));
        file.replaceText('«Bottle_Size»', data.fill);
        file.replaceText('«Bottle_Type»', data.btype);
        file.replaceText('«Cap_Type»', data.lid);
        file.replaceText('«Pack_Type»', (data.packagingType ? data.packagingType.name : ''));
        file.replaceText('«Product_Description»', order.productdescription);
        file.replaceText('<<Product_Code>>', order.productcode);



        file.replaceText('«Production_QTY»', data.bottles);

        file.replaceText('«BAL_QTY»', order.partialProduction);
        file.replaceText('«Liquid_Amount_Req»', data.bsize * data.bottles / 1000);
        file.replaceText('«Liquid Batch»', data.mixbatch);
        file.replaceText('<<OrderDate>>', formatDateDisplay(order.orderdate));
        file.replaceText('<<Brand>>', order.brand);


        file.replaceText('<<Label description>>', order.botlabel ? order.botlabel : '');

        file.replaceText('<<Branded>>', order.backtubed);
        file.replaceText('<<Premix>>', order.premixed);


        file.replaceText('«Premix Type Serum»', PC.premixdescrSerum);
        file.replaceText('«Premix Batch Serum»', order.serumBatchCode ? order.serumBatchCode : '');
        file.replaceText('«Liquid_Amount_Req Serum»', order.premixedSerum);
        file.replaceText('«Premix Type Stimulant»', PC.premixdescrStimulant);
        file.replaceText('«Premix Batch Stimulant»', order.stimulantBatchCode ? order.stimulantBatchCode : '');
        file.replaceText('«Liquid_Amount_Req Stimulant»', order.premixedStimulant);

    }
    Logger.log(folder.getUrl());

    return 'Production Notes generated in the Folder:<br> <a  target="_blank" href="' + folder.getUrl() + '">' + folder.getName() + '</a>';


}


function checkPackagePrinting(SELECTED, force) {
    var msg = 'Batches already packaged. Please Unselect Them:<br>';
    var found = false;
    for (var i = 0; i < SELECTED.length; i++) {

        var data = base.getData('Packaging/' + SELECTED[i]);
        if (data.PRINTCODE) {
            found = true;
            msg += data.batch + ' - ' + data.PRINTCODE + '<br>';
        }
    }
    if (found) {
        return [msg, 'PackagePrint'];
    } else {
        if (!force) {
            return printPackagingBatches(SELECTED, true);
        } else {
            return false;
        }
    }
}

function TESTPRINT(){

printPackagingBatches(['916242'], true)
}

function printPackagingBatches(SELECTED, force) {
    if (!force) {
        var printItems = checkPackagePrinting(SELECTED, force);
        if (printItems) {
            return printItems;
        }
    }
    var formattedDate = Utilities.formatDate(new Date(), "GMT", "dd-MM-yyyy");
    var folder = DriveApp.getFolderById(PACKAGING_NOTES_FOLDER);
    var PRINTCODE = getRandom() * getRandom();
    var create = DriveApp.getFileById(PACKAGING_FILE_ID).makeCopy(PRINTCODE, folder);
    var file = DocumentApp.openById(create.getId());


    for (var i = 0; i < SELECTED.length; i++) {

        var data = base.getData('Packaging/' + SELECTED[i]);
        var order = base.getData('Orders/'+ SELECTED[i]);
        if (!data) {
            continue;
        }
        file.replaceText('«date»', formattedDate);
        file.replaceText('«BoxNo»', PRINTCODE);

        file.replaceText('«Product_Code' + (i + 1) + '»', order.orderID);
        file.replaceText('«Product_Description' + (i + 1) + '»', SELECTED[i] + ',' + data.productdescription );
        file.replaceText('«Ordered' + (i + 1) + '»', data.bottles);

        dat1 = {
            PRINTCODE: PRINTCODE
        }
        base.updateData('Shipping/' + SELECTED[i], dat1);
        base.updateData('Packaging/' + SELECTED[i], dat1);
    }
    for (; i < 21; i++) {
        file.replaceText('«Product_Code' + (i + 1) + '»', '');
        file.replaceText('«Product_Description' + (i + 1) + '»', '');
        file.replaceText('«Ordered' + (i + 1) + '»', '');


    }


    return ['Packaging Notes generated in the folder:<br> <a  target="_blank" href="' + folder.getUrl() + '">' + folder.getName() + ' - ' + PRINTCODE + '</a>', 'PackagePrint'];


}



function testPrintShippingNotes() {
    var orders = JSONtoARR(base.getData('Orders'));
    var filtered = orders.filter(function(item) {
        return !item.PRINTCODE
    })

    printShippingNote(['71474925', '4670815', '27656320'], 1);
}


function printShippingNote(data, x) {
    var orderIDs = [];
    var orderDates = [];
    var incomplete = [];
    var formattedDate = Utilities.formatDate(new Date(), "GMT", "dd-MM-yyyy");
    var SHIPPINGCODE = getRandom() * getRandom();
    var folder = DriveApp.getFolderById(SHIPPING_NOTES_FOLDER);
    if (x == 1) {
        var create = DriveApp.getFileById(SHIPPING_FILE_ID).makeCopy(SHIPPINGCODE, folder);
    } else if (x == 2) {

        var create = DriveApp.getFileById(SHIPPING_FILE_ID2).makeCopy(SHIPPINGCODE, folder);

    }
    var SS = SpreadsheetApp.openById(create.getId());
    var sheet = SS.getSheets()[0];
    var orders = base.getData('Orders');

    var packagingData = base.getData('Packaging')
    var list = JSONtoARR(base.getData('Shipping'));
    var values = [];
    var customer;
    var batches = [];
    var Filename = '';
    var customers = [];

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < list.length; j++) {

            if (data[i] == list[j].PRINTCODE) {



                if (orders[list[j].batch]) {

                    customer = list[j].customer;
                    if (customers.length >= 1) {
                        if (customers[customers.length - 1] != customer) {
                            Filename += ", " + data[i] + " '" + customer + "'";
                            customers.push(customer);
                        }
                    } else {
                        Filename += data[i] + " '" + customer + "'";
                        customers.push(customer);
                    }

                    if (orders[list[j].batch].final_status == 'Completed') {
                        if (orders[list[j].batch + "PO"] || orders[list[j].batch + "PK"]) {
                            if (orders[list[j].batch + "PO"]) {
                                if (orders[list[j].batch + "PO"].final_status != 'Completed') {
                                    values.push([data[i], list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, parseInt(orders[list[j].batch].bottles, 10) - parseInt(orders[list[j].batch + "PO"].bottles, 10), orders[list[j].batch + "PO"].bottles]);
                                } else {
                                    values.push([data[i], list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, orders[list[j].batch].bottles, '']);
                                }
                            }
                            if (orders[list[j].batch + "PK"]) {
                                if (orders[list[j].batch + "PK"].final_status != 'Completed') {
                                    values.push([data[i], list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, parseInt(orders[list[j].batch].bottles, 10) - parseInt(orders[list[j].batch + "PK"].bottles, 10), orders[list[j].batch + "PK"].bottles]);
                                } else {
                                    values.push([data[i], list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, orders[list[j].batch].bottles, '']);
                                }
                            }
                        } else {
                            values.push([data[i], list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, packagingData[list[j].batch].bottles, '']);
                        }
                        orderIDs.push(list[j].orderID);
                        orderDates.push(formatDateDisplay(list[j].orderdate));
                        batches.push(list[j].batch);
                    } else {
                        incomplete.push([data[i], list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, '', packagingData[list[j].batch].bottles]);

                    }
                } else {
                    incomplete.push([data[i], list[j].batch + ' ' + list[j].productcode + ' ' + list[j].productdescription, packagingData[list[j].batch].bottles, '', packagingData[list[j].batch].bottles]);
                }
            }



        }

    }
    Filename += ' ' + formattedDate;
    SS.rename(Filename);

    for (var i = 0; i < values.length; i++) {
        var first = values[i][0];
        for (var j = i + 1; j < values.length; j++, i++) {
            if (values[j][0] == first) {
                values[j][0] = '';
            } else {

                break;
            }

        }

    }
    var orderIDsFiltered = uniq(orderIDs);
    for (var i = 0; i < list.length; i++) {

        for (var j = 0; j < orderIDsFiltered.length; j++) {
            if (list[i].orderID == orderIDsFiltered[j] && packagingData[list[i].batch]) {
                if (data.indexOf(packagingData[list[i].batch].PRINTCODE) >= 0) {
                    continue;
                }
                if (packagingData[list[i].batch].final_status == 'Completed') {
                    continue;
                }

                incomplete.push(['', list[i].batch + ' ' + list[i].productcode + ' ' + list[i].productdescription, packagingData[list[i].batch].bottles, '', packagingData[list[i].batch].bottles]);
            }

        }

    }


    if (values.length > 0) {
        sheet.getRange(17, 1, values.length, values[0].length).setValues(values);
    }
    if (incomplete.length > 0) {
        sheet.getRange(17 + values.length + 1, 1, incomplete.length, incomplete[0].length).setValues(incomplete);
    }
    // sheet.getRange(3,9,5,1).clearFormat();
    sheet.getRange(3, 4, 5, 1).setValues([
        [uniq(orderDates).join('; ')],
        [orderIDsFiltered.join('; ')],
        [SHIPPINGCODE],
        [customer],
        [formattedDate]
    ]);
    sheet.getRange(11, 1).setValue(customer);
    var addr = base.getData('Customers/' + customer + '/address');
    if (!addr) {
        addr = 'No address in the database for this Customer.';
    }
    sheet.getRange(12, 1).setValue(addr);
    Logger.log(SS.getUrl());
    var dat = {
        SHIPPINGCODE: SHIPPINGCODE,
        dateshipped: new Date().getTime(),
        shipping_status: 'Shipped',
    };
    for (var i = 0; i < batches.length; i++) {
        base.updateData('Shipping/' + batches[i], dat);

    }
    Logger.log(SS.getUrl());
    return 'Shipping Note generated with the url:<br> <a  target="_blank" href="' + SS.getUrl() + '">' + SS.getName() + '</a>';
}

function removeBfromShipping(){
  var shippingData = base.getData('Shipping');
  Object.keys(shippingData).map(function(item){
     var suffix = item.substr(-1);
    if(suffix == 'B'){
    delete shippingData[item];
    }
  })
base.removeData('Shipping')
base.updateData('Shipping',shippingData)
}
function printShippingNoteNoPrintcode() {
   
    var orders = base.getData('Orders');

    var packagingData = base.getData('Packaging')
    var shippingData = base.getData('Shipping');
  var customers = base.getData('Customers');
  var list = JSONtoARR(shippingData).sort(sortNUMHL('dateshipped')).filter(function(item){
  return !item.SHIPPINGCODE 
  });
 
    var folder = DriveApp.getFolderById(SHIPPING_NOTES_FOLDER);
    var file = DriveApp.getFileById(SHIPPING_FILE_ID);
 var start = new Date().getTime();
  var last = '';
  for (var j = 0; j < list.length; j++) {
    if(  new Date().getTime() - start < 4*1000*60){
    var orderIDs = [];
    var orderDates = [];
    var incomplete = [];
    var formattedDate = Utilities.formatDate(new Date(list[j].dateshipped), "GMT", "dd-MM-yyyy");
    var SHIPPINGCODE = getRandom() * getRandom();

    var create = file.makeCopy(SHIPPINGCODE, folder);
    
    var SS = SpreadsheetApp.openById(create.getId());
    var sheet = SS.getSheets()[0];
    var values = [];
    var customer;
    var batches = [];
    var Filename = '';
    var customers = [];



        if (orders[list[j].batch]) {

            customer = list[j].customer;
            if (customers.length >= 1) {
                if (customers[customers.length - 1] != customer) {
                    Filename += ", " + '' + " '" + customer + "'";
                    customers.push(customer);
                }
            } else {
                Filename += '' + " '" + customer + "'";
                customers.push(customer);
            }

            if (orders[list[j].batch].final_status == 'Completed') {
                if (orders[list[j].batch + "PO"] || orders[list[j].batch + "PK"]) {
                    if (orders[list[j].batch + "PO"]) {
                        if (orders[list[j].batch + "PO"].final_status != 'Completed') {
                            values.push(['', list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, parseInt(orders[list[j].batch].bottles, 10) - parseInt(orders[list[j].batch + "PO"].bottles, 10), orders[list[j].batch + "PO"].bottles]);
                        } else {
                            values.push(['', list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, orders[list[j].batch].bottles, '']);
                        }
                    }
                    if (orders[list[j].batch + "PK"]) {
                        if (orders[list[j].batch + "PK"].final_status != 'Completed') {
                            values.push(['', list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, parseInt(orders[list[j].batch].bottles, 10) - parseInt(orders[list[j].batch + "PK"].bottles, 10), orders[list[j].batch + "PK"].bottles]);
                        } else {
                            values.push(['', list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, orders[list[j].batch].bottles, '']);
                        }
                    }
                } else {
                    values.push(['', list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, packagingData[list[j].batch].bottles, '']);
                }
                orderIDs.push(list[j].orderID);
                orderDates.push(formatDateDisplay(list[j].orderdate));
                batches.push(list[j].batch);
            } else {
                incomplete.push(['', list[j].batch + ' ' + orders[list[j].batch].productcode + ' ' + orders[list[j].batch].productdescription, orders[list[j].batch].bottles, '', packagingData[list[j].batch].bottles]);

            }
        } else {
            incomplete.push(['', list[j].batch + ' ' + list[j].productcode + ' ' + list[j].productdescription, packagingData[list[j].batch].bottles, '', packagingData[list[j].batch].bottles]);
        }




        Filename += ' ' + formattedDate;
        SS.rename(Filename);

        for (var i = 0; i < values.length; i++) {
            var first = values[i][0];
            for (var v = i + 1; v < values.length; v++, i++) {
                if (values[v][0] == first) {
                    values[v][0] = '';
                } else {

                    break;
                }

            }

        }
        var orderIDsFiltered = uniq(orderIDs);
       


        if (values.length > 0) {
            sheet.getRange(17, 1, values.length, values[0].length).setValues(values);
        }
       
        // sheet.getRange(3,9,5,1).clearFormat();
        sheet.getRange(3, 4, 5, 1).setValues([
            [uniq(orderDates).join('; ')],
            [orderIDsFiltered.join('; ')],
            [SHIPPINGCODE],
            [customer],
            [formattedDate]
        ]);
        sheet.getRange(11, 1).setValue(customer);
        var addr = customers[customer] ? customer[customer].address : false;
         
        if (!addr) {
            addr = 'No address in the database for this Customer.';
        }
        sheet.getRange(12, 1).setValue(addr);
        Logger.log(SS.getUrl());
        var dat = {
            SHIPPINGCODE: SHIPPINGCODE,
            shipping_status: 'Shipped',
        };
      for (var i = 0; i < batches.length; i++) {
        shippingData[batches[i]].SHIPPINGCODE = dat.SHIPPINGCODE;
        shippingData[batches[i]].shipping_status = dat.shipping_status; 
        
      }
      
    }
    }
  
  base.updateData('Shipping',shippingData);
    return 'Shipping Note generated with the url:<br> <a  target="_blank" href="' + SS.getUrl() + '">' + SS.getName() + '</a>';
}

function printOrdersBatches(SELECTED) {
    var orderIDs = [];
    var orderDates = [];
    var formattedDate = Utilities.formatDate(new Date(), "GMT", "dd-MM-yyyy");

    var folder = DriveApp.getFolderById(ORDERS_FOLDER);

    var create = DriveApp.getFileById(ORDER_FILE_ID).makeCopy(folder.getName(), folder);
    var SS = SpreadsheetApp.openById(create.getId());
    var sheet = SS.getSheets()[0];
    var data = JSONtoARR(base.getData('Orders'));

    var values = [];


    for (var i = 0; i < data.length; i++) {

        if (!data[i].recipe) {
            continue;
        }
        if (SELECTED.indexOf(data[i].batch) != -1) {
            if (data[i].packagingType) {
                if (data[i].packagingType.name) {

                } else {
                    data[i].packagingType.name = '';
                }
            }
            if (data[i].final_status == "started") {
                data[i].final_status = "Started";
            } else if (data[i].final_status == "Completed") {
                data[i].final_status == "Completed"

            } else {
                data[i].final_status == "Not Run"
            }

            //        data.mixing_status = 0;
            //        data.production_status = 0;
            //        data.printing_status = 0;
            //        data.labeling_status = 0;
            //        data.packaging_status = 0;
            //        

            values.push([formatDateDisplay(data[i].orderdate), data[i].batch, data[i].orderID, data[i].productcode, data[i].productdescription, data[i].customer, data[i].brand,
                data[i].bottles, data[i].btype, data[i].lid, data[i].packagingType.name,
                data[i].mixing, data[i].premixed, data[i].unbranded, data[i].branded, data[i].backtubed, data[i].final_status, data[i].mixing_status, data[i].production_status, data[i].printing_status, data[i].labeling_status, data[i].packaging_status
            ]);
        }


    }

    sheet.getRange(8, 1, values.length, values[0].length).setValues(values);
    return 'Orders generated with the url: <br> <a  target="_blank" href="' + SS.getUrl() + '">' + SS.getName() + '</a>';

}




function printxero(SELECTED) {
    try {
        var orderIDs = [];
        var orderDates = [];
        var formattedDate = Utilities.formatDate(new Date(), "GMT", "dd-MM-yyyy");

        var folder = DriveApp.getFolderById(XERO_FOLDER);

        var create = DriveApp.getFileById(XERO_FILE_ID).makeCopy(formattedDate, folder);
        var SS = SpreadsheetApp.openById(create.getId());
        var sheet = SS.getSheets()[0];
        var data = JSONtoARR(base.getData('Orders'));

        var values = [];


        for (var i = 0; i < data.length; i++) {

            if (!data[i].recipe || (data[i].batch.toLowerCase().match('po') || data[i].batch.toLowerCase().match('pk'))) {
                continue;
            }
            if (SELECTED.indexOf(data[i].orderID) >= 0) {
                var shipItem = base.getData("Shipping/" + data[i].batch);
                var PC = base.getData("References/ProductCodes/" + data[i].productcode);
                shipItem = shipItem ? shipItem : {}
                values.push([data[i].customer, '', '', '', '', '', '', '', '', '', data[i].orderID, shipItem.SHIPPINGCODE || "", shipItem.dateshipped || '', shipItem.dateshipped || '', '',
                    data[i].productcode, data[i].productdescription, data[i].bottles, PC.price || '', '', '212 - Sales of Product Income', '20% (VAT on Income)'
                ]);

            }


        }

        sheet.getRange(2, 1, values.length, values[0].length).setValues(values);
        return 'Orders generated with the url: <br> <a  target="_blank" href="' + SS.getUrl() + '">' + SS.getName() + '</a>';
    } catch (e) {

        return "Error Printing Xero: " + e.message;
    }
}