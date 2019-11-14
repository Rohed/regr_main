function trydateformat() {
    var dat = '22/12/2017';

    var f1 = dat.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, "$3-$2-$1");
    var d1 = new Date(f1);
    d1 = Utilities.formatDate(new Date(f1), "GMT", "dd-MM-yyyy");
    var f2 = dat.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, "$3-$2-$1");
    var d2 = new Date(f2);
    d2 = Utilities.formatDate(new Date(f2), "GMT", "dd-MM-yyyy");
    var f3 = dat.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, "$3-$2-$1");
    var d3 = new Date(f3);
    d3 = Utilities.formatDate(new Date(f3), "GMT", "dd-MM-yyyy");
}

function testgetlarges() {
       var rawOrders = base.getData('Orders');

        var orders = JSONtoARR(rawOrders);
        var largestBatch = getLargestBatch(orders);
        Logger.log(largestBatch);
}


function getLargestBatch(orders) {
    if (orders.length) {
        var largestBatch = base.getData('highestBatch');
        largestBatch = isNaN(largestBatch) ? 0 : largestBatch;
        var batches = orders.map(function(obj) {
            var ret;
            ret = obj.batch;
            return ret;
        });
        batches = batches.filter(function(item) {
            if (item != 'undefined' && item != 'NaN') {
                return true
            }
        }).sort();
        var last = batches.slice(batches.length - 10, batches.length);
        var largest = parseInt(batches[batches.length - 1], 10);
        if (largestBatch) {
            if (largestBatch > largest) {
                return largestBatch;
            } else {
                return largest;
            }

        } else {
            return largest;
        }
    } else {
        return 1;
    }
}



function saveOrder2(data, row) {



    data.partialProduction = 0;
    data.partialPackaging = 0;
    data.saved = true;
    data.premixed = 0;
  data.premixedSerum = 0;
  data.premixedStimulant = 0;
    data.backtubed = 0;
    data.production_status = 0;
    data.printing_status = 0;
    data.labeling_status = 0;
    data.packaging_status = 0;
    data.final_status = 0;
    data.row = row;
    data.userset = false;
    var suffix = data.batch.toString().substr(-1);
    var suf2 = data.batch.substr(-2);
 
    data.orderdate ? null : data.orderdate = (new Date()).getTime();

  


    var rett = JSON.stringify(data);
    return rett;



}

function importMassSheet() {

    saveFileCsv(null, null, 1, 2)

}

function saveFileCsv(data, name, sheetRow, numRows) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import CSV',
        batch: name,
        page: 'CSV',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };


    try {
        var msg = '';

      
        var contentType = data.substring(5, data.indexOf(','));
        var fileBlob = Utilities.newBlob(Utilities.base64Decode(data.substr(data.indexOf('base64,') + 7)), contentType, name);

        var values = [];

        var rows = fileBlob.getDataAsString().replace(/\t/g, '');

        values = Utilities.parseCsv(rows);
        //
        //     SpreadsheetApp.openById('10lo4vLIJONltnwO_n1Va5ixkIE7_Z4Y-7DEZRE5_8xc').getSheets()[0].getRange(1, 1, values.length, values[0].length).clear().setValues(values);
        //      var values =sheet.getRange(sheetRow, 1, numRows, sheet.getLastColumn()).getValues();
//     var sheet = SpreadsheetApp.openById('1qnNZR0XiDmeo2atlhpOdnfkA3WKtCyiAQUdFOGDemuY').getSheets()[0];
//     var values =sheet.getDataRange().getValues();
//     
//    
        if (values.length < 2) {

            msg += "Failed to read file.";


        }

        var fileBlob = '';
        data = '';
        var rows = '';
        //var values = SpreadsheetApp.openById('1xvW_vuMnkI5OvPdeZ0GVZKLIAv95_OxoXfCBm1ER3lY').getSheets()[0].getDataRange().getValues();

        var PCPD = base.getData("References/ProductCodes");
        var roundups = base.getData('Roundups');
        var options = '{';
        //  var allPC=base.getData("References/ProductCodes");
        var allPC = '';
        var rawOrders = base.getData('Orders');

        var orders = JSONtoARR(rawOrders);
        var largestBatch = getLargestBatch(orders);

        //var orderID=getNewOrderID2(orders);
        var ordersByOrderID = orders.filter(function(item) {
            return item.orderID
        }).sort(sortOrderIDsHL)

        if (ordersByOrderID.length >= 1) {
            var LastorderID = ordersByOrderID[0].orderID;
            if (LastorderID) {
                var num = parseInt(LastorderID, 10) + 1;
            } else {
                for (var i = ordersByOrderID.length - 2; i > 0; i--) {
                    var LastorderID = ordersByOrderID[i].orderID;
                    if (LastorderID) {
                        var cutString = LastorderID;
                        var num = (parseInt(cutString, 10) + 1);
                        if (num >= 1) {
                            break;
                        }
                    }
                }
            }
        } else {
            var num = 1;
        }

        var orderID = num;
        ordersByOrderID = {};

        var newPRIORITIES = [];


        for (var i = 1; i < values.length; i++) {
            try {
                if (!values[i][0]) {
                    var num = parseInt(orderID, 10) + 1;
                    if (num < 1) {
                        num = 1;
                    }
                    orderID = num;
                    continue;
                }
                Logger.log(values[i]);
                Logger.log('------');
                Logger.log('------');
                Logger.log(values[i][0]);
                Logger.log(values[i][0]);

                var PC = values[i][0];
                // var dataPC = base.getData("References/ProductCodes/" + PC);
                var dataPC = PCPD[PC];
                Logger.log(dataPC);

                if (dataPC) {
                  var orderdate = values[i][7] ? values[i][7].toString().split('/') : false;
                  if(orderdate){
                    orderdate = new Date(orderdate[1]+'/'+orderdate[0]+'/'+orderdate[2]).getTime();
                  }
                    var item = {
                        boxname: dataPC.boxname,
                         booklet: dataPC.booklet,
                        fill: dataPC.fill,
                        orderdate: orderdate,
                        //    batch: values[i][0],
                        priority: '',
                        customer: values[i][2],
                        customerSKU: values[i][3],
                        serumBatchCode: values[i][9],
                        stimulantBatchCode: values[i][10],
                        brand: dataPC.brand,
                        brandSKU: dataPC.brandSKU,
                        bottles: parseInt(values[i][1], 10),
                        combs: parseInt(values[i][1], 10),
                        stocking: 0,
                        btype: dataPC.btype,
                        lid: dataPC.lid,
                        botSKU: dataPC.botSKU,
                        lidSKU: dataPC.lidSKU,
                        tubeType: dataPC.tubeType,
                        tubeSKU: dataPC.tubeSKU,
                        packaging: dataPC.packaging,
                        packagingType: dataPC.packagingType,
                        orderID: values[i][6] || orderID,
                        productcode: dataPC.prod,
                        productdescription: dataPC.descr,

                    };
 

                    if (dataPC.multipliers) {
                        item.combs = dataPC.multipliers.combs * item.combs;
                        item.bottles = dataPC.multipliers.bottles * item.bottles;

                    }

                    item.serum = dataPC.fill * item.bottles;
                    item.stimulant = dataPC.fill * item.bottles;
                    item.boxname = dataPC.boxname;
                    item.booklet = dataPC.booklet;

                    if (values[i][4]) {
                        values[i][4] = values[i][4].toLowerCase();
                    }
                    if (values[i][5]) {
                        values[i][5] = values[i][5].toLowerCase();
                    }

                    if (values[i][4] == 'y') {
                        item.ppb = true;
                        item.botlabel = dataPC.ppbotlabel;
                        item.botlabelsku = dataPC.ppbotlabelsku;
                    } else {
                        item.ppb = false;
                        item.botlabel = dataPC.botlabel;
                        item.botlabelsku = dataPC.botlabelsku;
                    }
                    if (values[i][5] == 'y') {
                        item.ppp = true;
                        item.packlabel = dataPC.pppacklabel;
                        item.packlabelsku = dataPC.pppacklabelsku;
                    } else {
                        item.ppp = false;
                        item.packlabel = dataPC.packlabel;
                        item.packlabelsku = dataPC.packlabelsku;
                    }

                    if (!dataPC.usecomb) {
                        item.combs = 0;
                        item.usecomb = false;
                    } else {
                        item.usecomb = true;
                    }
                  
                  var QTY = calcQTY(item.stocking, item.bottles, item.fill, null, item.customer, null);
                  QTY = Math.ceil(QTY / roundups.batch) * roundups.batch;
                  item.QTY = QTY;
                } else {
                    LOGDATA.data.push(['Missing PC', PC]);
                    msg += 'Unable to SAVE ' + PC + ' On line: ' + i + '. Reason: Missing '+PC+'<br>';
                    // msg += 'DATA: ' + item.ratio + '<br>'; 
                    continue;
                }

         

                if (i == 1) {
                    if (orders.length) {
                        var ordersL = orders.length;
                        var row = orders.length + 1;
                        var lastbatch = orders[orders.length - 1].batch;
                        var inint = parseInt(lastbatch, 10);
                        item.batch = (parseInt(orders[orders.length - 1].batch, 10) + 1).toString();
                        var batch = checkBatchExists(rawOrders, item.batch, ordersL, largestBatch);
                        item.batch = batch;
                    } else {
                        var ordersL = 1;
                        var row = 1;

                        item.batch = '911000';
                        var batch = '911000'
                    }
                } else {
                    row++;
                    ordersL++;
                    batch = parseInt(batch, 10);
                    batch++;
                    item.batch = (batch).toString()

                }

                if (i == values.length - 1) {
                    base.updateData('', {
                        'highestBatch': parseInt(batch, 10)
                    });
                }
              if(values[i][11]){
                if(values[i][11].toLowerCase() == 'y'){
                  item.batch = item.batch+"B";
                   
                }else{
                item.usecomb = false;
                item.combs = 0;
                }
              }
               var suffix = item.batch.substr(-1);
              if(item.bottles%roundups.bottles != 0  && suffix == BRANDED_STOCK_SUFFIX){
                var err = "<br>Error: Please adjust the amount of bottles for "+PC+" to fit the batch of "+roundups.batch+"L <br>";
                err += 'Bottles should be a multiple of '+roundups.bottles;
                msg += err;
                continue;
              }
             
                var resp = saveOrder2(item, row);
                orderID = item.orderID;
                msg += 'Added Batch ' + item.batch + ' With Order ID: ' + orderID + '<br>';
                LOGDATA.data.push(['Added Batch', item.batch + ' With Order ID: ' + orderID]);
                options += '"' + item.batch + '":' + resp + ',';


            } catch (e) {
                LOGDATA.status = false;
                LOGDATA.data.push(['Failed to upload:', PC]);
                LOGDATA.data.push(['Failed: ', e.toString()]);
                Logger.log(e.toString());
                Logger.log(item);
                //   break;

                //     Logger.log('why');
                //      Logger.log(e.message);
                msg += e.toString() + '<br>';
                msg += 'Unable to Process ' + PC + ' On line: ' + i + '<br>';
            }
            newPRIORITIES.push([values[i][8], '', true, orderID]);
        }

        options += '}';
        // Logger.log(options);
        try {
            var dat1 = JSON.parse(options);
            base.updateData('Orders', dat1);
        } catch (e) {
            LOGDATA.status = false;

            LOGDATA.data.push(['Failed: ', e.toString()]);
            msg += 'Failed Upload <br>' + options;
        }
        logItem(LOGDATA);
        allPC = '';

        rawOrders = '';

        orders = '';
        largestBatch = '';

        orderID = '';
        dat1 = '';
        newPRIORITIES = uniq3(newPRIORITIES);
        for (var i = 0; i < newPRIORITIES.length; i++) {
            if (newPRIORITIES[i][0]) {

                setPriorityARR(newPRIORITIES);
                break;
            }

        }
        //setPriorityARR(newPRIORITIES);
        return msg + ' ' + i;
    } catch (e) {
        LOGDATA.data.push(['Failed: ', msg + ' - ' + e.toString()]);
        logItem(LOGDATA);
        return msg + ' ' + i;
    }
}
 
function uniq3(a) {
    var prims = {
            "boolean": {},
            "number": {},
            "string": {}
        },
        objs = [];

    return a.filter(function(item) {
        var type = typeof item[3];
        if (type in prims)
            return prims[type].hasOwnProperty(item[3]) ? false : (prims[type][item[3]] = true);
        else
            return objs.getIndex2(item[3]) >= 0 ? false : objs.push(item);
    });
}