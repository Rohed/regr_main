function toPrinting(data) {
    var dat = base.getData('Printing');
    var mixARR = [];
    if (dat) {
        var result = Object.keys(dat).map(function(key) {
            return [Number(key), dat[key]];
        });
        var row = result.length + 1;
    } else {
        var row = 1;
    }
    var dat1 = {
        'numLabelsBottles': data.numLabelsBottles,
        'numLabelsTubes': data.numLabelsTubes,
        'boxname': data.boxname,
         'booklet': data.booklet,
        'priority': data.priority,
        'recipe': data.recipe,
        'batch': data.batch,
        'flavour': data.flavour,
        'orderdate': data.orderdate,
        'customer': data.customer,
        'brand': data.brand,
        'bottles': data.bottles,
        'btype': data.btype,
        'lid': data.lid,
        'fill': data.fill,
        'botSKU': data.botSKU,
        'lidSKU': data.lidSKU,
        'tubeType': data.tubeType,
        'tubeSKU': data.tubeSKU,
        'usecomb': data.usecomb,
        'combs': data.combs,
        'serumBatchCode': data.serumBatchCode,
        'stimulantBatchCode': data.stimulantBatchCode,
        'packaging': data.packaging,
        'ProductionCompleted': data.production_status,
        'Completed': 0,
        'starttime': 0,
        'CompletionDate': '',
        'Location': '',
        'row': row,
        QTY: data.QTY,
        'userset': false,
        'movedtoNext': 0,
        'packagingType': data.packagingType,
        'final_status': 0,
        'bsize': parseInt(data.btype.replace(/\D/g, ''), 10),
        'productcode': data.productcode,
        'productdescription': data.productdescription,
        botlabel: data.botlabel,
        botlabelsku: data.botlabelsku,
        packlabel: data.packlabel,
        packlabelsku: data.packlabelsku,
        ppp: data.ppp,
        ppb: data.ppb,
        customerSKU: data.customerSKU,
        brandSKU: data.brandSKU,
    };
    base.updateData('Printing/' + data.batch, dat1);
}

function toLabelling(data) {
    var dat = base.getData('Labelling');
    var mixARR = [];
    if (dat) {
        var result = Object.keys(dat).map(function(key) {
            return [Number(key), dat[key]];
        });
        var row = result.length + 1;
    } else {
        var row = 1;
    }
    var dat1 = {
        botlabel: data.botlabel,
        botlabelsku: data.botlabelsku,
        packlabel: data.packlabel,
        packlabelsku: data.packlabelsku,
        'boxname': data.boxname,
         'booklet': data.booklet,
        'priority': data.priority,
        'recipe': data.recipe,
        'batch': data.batch,
        'flavour': data.flavour,
        'orderdate': data.orderdate,
        'customer': data.customer,
        'brand': data.brand,
        'bottles': data.bottles,
        'btype': data.btype,
        'lid': data.lid,
        'fill': data.fill,
        'botSKU': data.botSKU,
        'lidSKU': data.lidSKU,
        'tubeType': data.tubeType,
        'tubeSKU': data.tubeSKU,
        'usecomb': data.usecomb,
        'combs': data.combs,
        'serumBatchCode': data.serumBatchCode,
        'stimulantBatchCode': data.stimulantBatchCode,
        'packagingType': data.packagingType,
        'packaging': data.packaging,
        'ProductionCompleted': data.production_status,
        'PrintingCompleted': data.printing_status,
        'Completed': 0,
        'starttime': 0,
        'CompletionDate': '',
        'Location': '',
        'row': row,
        QTY: data.QTY,
        'userset': false,
        'movedtoNext': 0,
        'final_status': 0,
        'bsize': parseInt(data.btype.replace(/\D/g, ''), 10),
        'machineL': data.machineL,
        'productcode': data.productcode,
        'productdescription': data.productdescription,
        ppp: data.ppp,
        ppb: data.ppb,
        customerSKU: data.customerSKU,
        brandSKU: data.brandSKU,
    };
    base.updateData('Labelling/' + data.batch, dat1);
}

function toProduction(data) {
    var dat = base.getData('Production');
    var mixARR = [];
    if (dat) {
        var result = Object.keys(dat).map(function(key) {
            return [Number(key), dat[key]];
        });
        var row = result.length + 1;
    } else {
        var row = 1;
    }
    var dat1 = {
        botlabel: data.botlabel,
        botlabelsku: data.botlabelsku,
        packlabel: data.packlabel,
        packlabelsku: data.packlabelsku,
        'boxname': data.boxname,
         'booklet': data.booklet,
        'priority': data.priority,
        'recipe': data.recipe,
        'batch': data.batch,
        'flavour': data.flavour,
        'orderdate': data.orderdate,
        'customer': data.customer,
        'brand': data.brand,
        'bottles': data.bottles,
        'btype': data.btype,
        'lid': data.lid,
        'fill': data.fill,
        'botSKU': data.botSKU,
        'lidSKU': data.lidSKU,
        'tubeType': data.tubeType,
        'tubeSKU': data.tubeSKU,
        'usecomb': data.usecomb,
        'combs': data.combs,
        'serumBatchCode': data.serumBatchCode,
        'stimulantBatchCode': data.stimulantBatchCode,
        'packagingType': data.packagingType,
        'packaging': data.packaging,
        'Completed': 0,
        'starttime': 0,
        'CompletionDate': '',
        'Location': '',
        'row': row,
        'userset': false,
        'final_status': 0,
        'movedtoNext': 0,
        QTY: data.QTY,
        'bsize': parseInt(data.btype.replace(/\D/g, ''), 10),
        'machineP': data.machineP,
        'productcode': data.productcode,
        'productdescription': data.productdescription,
        customerSKU: data.customerSKU,
        brandSKU: data.brandSKU,
    };
    if (data.final_status) {
        dat1.final_status = data.final_status;
    } else {
        dat1.final_status = 0;
    }
    //    if (data.recipe.name.match('Nicotine')) {
    //        dat1.nic = data.recipe.nic;
    //    } else {
    //        dat1.cbd = data.recipe.cbd;
    //    }
    base.updateData('Production/' + data.batch, dat1);
}

function toPackaging(data) {
    var dat = base.getData('Packaging');
    var mixARR = [];
    if (dat) {
        var result = Object.keys(dat).map(function(key) {
            return [Number(key), dat[key]];
        });
        var row = result.length + 1;
    } else {
        var row = 1;
    }
    var dat1 = {
        botlabel: data.botlabel,
        botlabelsku: data.botlabelsku,
        packlabel: data.packlabel,
        packlabelsku: data.packlabelsku,
        'boxname': data.boxname,
         'booklet': data.booklet,
        'priority': data.priority,
        'recipe': data.recipe,
        'batch': data.batch,
        'flavour': data.flavour,
        'orderdate': data.orderdate,
        'customer': data.customer,
        'brand': data.brand,
        'bottles': data.bottles,
        'btype': data.btype,
        'lid': data.lid,
        'fill': data.fill,
        'botSKU': data.botSKU,
        'lidSKU': data.lidSKU,
        'tubeType': data.tubeType,
        'tubeSKU': data.tubeSKU,
        'usecomb': data.usecomb,
        'combs': data.combs,
        'serumBatchCode': data.serumBatchCode,
        'stimulantBatchCode': data.stimulantBatchCode,
        'packagingType': data.packagingType,
        'packaging': data.packaging,
        'PrintingCompleted': data.printing_status,
        'ProductionCompleted': data.production_status,
        'PackagingCompleted': 0,
        'Completed': 0,
        'starttime': 0,
        'CompletionDate': '',
        'Location': '',
        'row': row,
        'userset': false,
        'movedtoNext': 0,
        'final_status': 0,
        'bsize': parseInt(data.btype.replace(/\D/g, ''), 10),
        'productcode': data.productcode,
        'productdescription': data.productdescription,
        customerSKU: data.customerSKU,
        brandSKU: data.brandSKU,
    };
    base.updateData('Packaging/' + data.batch, dat1);
}


function testmove() {
    MoveItem('914932', 'Production')
}




function MoveItem(batch, sheet) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Line Item Move',
        batch: batch,
        page: sheet,
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    var data = base.getData(sheet + '/' + batch);
    if(data){
    data.current = sheet;
    var result = [];
    try {
        var data = moveMain(data);
        LOGDATA.data = LOGDATA.data.concat(data);
        LOGDATA.data.push(['SUCCESS:', "Line Item has been moved."]);
        logItem(LOGDATA);
        result.push(batch + ' Success');
    } catch (e) {
        LOGDATA.status = false;
        result.push(batch + ' Failed ' + e.message);
        LOGDATA.data.push(['Failed:', 'Failed ' + e.message]);
        logItem(LOGDATA);
    }
   
    return [result, sheet];
     }else{
    return ['Batch not found! '+batch+' in '+sheet, sheet];  
     }
}

function moveMain(item) {
    var LOGARR = [];

    var order = base.getData('Orders/' + item.batch);
    var sheet_name = item.current;
    var next_sheet = sheets[sheets.indexOf(sheet_name) + 1];

    var suffix = item.batch.substr(-1);
    var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;
    if (sheet_name == 'Production') {
        if (item.prodBottles) {


            var diff = item.bottles - item.prodBottles;

            var diffvolume = order.fill * diff / 1000;
            var correction = {
                bottles: item.prodBottles,
                combs: item.prodBottles,
                serumBatchCode: item.serumBatchCode,
                stimulantBatchCode: item.stimulantBatchCode,
            };
            var packaging = base.getData('Packaging/' + item.batch)
            var correction2 = {
                bottles: packaging ? packaging.bottles - diff : 0,
                combs: packaging ? packaging.bottles - diff : 0,
                serumBatchCode: item.serumBatchCode,
                stimulantBatchCode: item.stimulantBatchCode,
            };

            var packData = getPackagingData(item.packagingType, Math.abs(diff), order.boxname.sku)
            var packink = packData.ink;
            var tube = packData.botperPack;
            var tubes = Math.abs(diff) / tube;
            var ink = 0;
            if (!item.ppb) {
                ink = Math.abs(diff) * 0.001;
            }
            if (!item.ppp) {
                ink += packink;
            }

            var boxname = order.boxname.sku;
             var bookletSKU= order.booklet.sku;
            var label = order.botlabelsku;
            var bookletSKU = order.booklet.sku;

            if (diff > 0) {
                fromReservedtoRunning('Lids/' + item.lidSKU, diff);
                LOGARR.push([item.lidSKU, diff]);
                fromReservedtoRunning('BottleTypes/' + item.botSKU, diff);
                LOGARR.push([item.botSKU, diff]);
                fromReservedtoRunning('BottleTypes/' + item.tubeSKU, diff);
                LOGARR.push([item.tubeSKU, diff]);


                fromReservedtoRunning("Misc/printing ink", ink);
                LOGARR.push(['Ink:', ink]);

                if (tube) {
                    if (item.packlabelsku != "" && item.packlabelsku != undefined) {
                        LOGARR.push([item.packlabelsku, tubes]);
                        fromReservedtoRunning('Labels/' + item.packlabelsku, tubes);
                    }
                }
                LOGARR.push([label, diff]);
                fromReservedtoRunning('Labels/' + label, diff);

                if (tube != 0) {
                    //WITH PACKAGING
                    if (for_branded_stock) {
                        fromReservedtoRunning('Packages/' + item.packagingType.sku, tubes);
                        LOGARR.push([item.packagingType.sku, tubes]);

                    } else {
                        var box = tubes / packData.divTubesForBox;
                        if (boxname) {
                            fromReservedtoRunning('Boxes/' + boxname, box);
                            LOGARR.push([boxname, box]);
                        }
                     
                        if (bookletSKU) {
                            fromReservedtoRunning('Booklets/' + bookletSKU, box);
                            LOGARR.push([bookletSKU, box]);
                        }

                        fromReservedtoRunning('Packages/' + item.packagingType.sku, tubes);
                        LOGARR.push([item.packagingType.sku, tubes]);

                    }
                }
                if (item.usecomb && for_branded_stock) {
                    fromReservedtoRunning("Misc/COMBWHITE", diff);
                }
            } else if (diff < 0) {
                diff = Math.abs(diff)
                diffvolume = Math.abs(diffvolume)
                fromRunningtoReserved('Lids/' + item.lidSKU, diff);
                LOGARR.push([item.lidSKU, diff]);
                fromRunningtoReserved('BottleTypes/' + item.botSKU, diff);
                LOGARR.push([item.botSKU, diff]);
                fromRunningtoReserved('BottleTypes/' + item.tubeSKU, diff);
                LOGARR.push([item.tubeSKU, diff]);


                fromRunningtoReserved("Misc/printing ink", ink);
                LOGARR.push(['Ink:', ink]);
                if (tube) {
                    if (item.packlabelsku != "" && item.packlabelsku != undefined) {
                        LOGARR.push([item.packlabelsku, tubes]);
                        fromRunningtoReserved('Labels/' + item.packlabelsku, tubes);
                    }
                }
                LOGARR.push([label, diff]);
                fromRunningtoReserved('Labels/' + label, diff);

                if (tube != 0) {
                    //WITH PACKAGING
                    if (for_branded_stock) {
                        fromRunningtoReserved('Packages/' + item.packagingType.sku, tubes);
                        LOGARR.push([item.packagingType.sku, tubes]);

                    } else {
                        var box = tubes / packData.divTubesForBox;
                        if (boxname) {
                            fromRunningtoReserved('Boxes/' + boxname, box);
                            LOGARR.push([boxname, box]);
                        }
 
                        if (bookletSKU) {
                            fromRunningtoReserved('Booklets/' + bookletSKU, box);
                            LOGARR.push([bookletSKU, box]);
                        }
                        fromRunningtoReserved('Packages/' + item.packagingType.sku, tubes);
                        LOGARR.push([item.packagingType.sku, tubes]);

                    }
                }

                if (item.usecomb && for_branded_stock) {
                    fromRunningtoReserved("Misc/COMBWHITE", diff);
                }
            }
            if (base.getData("Printing/" + item.batch)) {
                base.updateData("Printing/" + item.batch, correction);
            }
            if (base.getData("Labelling/" + item.batch)) {
                base.updateData("Labelling/" + item.batch, correction);
            }
            if (base.getData("Packaging/" + item.batch)) {
                base.updateData("Packaging/" + item.batch, correction2);
            }
            item.bottles = item.prodBottles;
            base.updateData("Production/" + item.batch, correction);
            base.updateData("Orders/" + item.batch, correction);

        }
        fromReservedtoCompleted('Lids/' + item.lidSKU, item.bottles);
        LOGARR.push([item.lidSKU, item.bottles]);
        fromReservedtoCompleted('BottleTypes/' + item.botSKU, item.bottles);
        LOGARR.push([item.botSKU, item.bottles]);
        fromReservedtoCompleted('BottleTypes/' + item.tubeSKU, item.bottles);
        LOGARR.push([item.tubeSKU, item.bottles]);



        var premixSerum = getPremixSKU(order, 'Serum');
        var premixStimulant = getPremixSKU(order, 'Stimulant');


        LOGARR.push(['Premix SKU Serum:', premixSerum]);
        LOGARR.push(['Premix SKU Stimulant:', premixStimulant]);
        var suffix = item.batch.substr(-1);


        var volume = order.fill * item.bottles / 1000;

        var dat1 = {
            production_status: 'Completed'
        };
        base.updateData('Orders/' + item.batch, dat1);
        var tominusP = order.premixedSerum;
        if (tominusP > 0) {
            PtoComplete(premixSerum, tominusP);
            LOGARR.push(['Serum Premix to Complete:', tominusP]);
        }

        var tominusP = order.premixedStimulant;
        if (tominusP > 0) {
            PtoComplete(premixStimulant, tominusP);
            LOGARR.push(['Stimulant Premix to Complete:', tominusP]);
        }
        if (item.hasoverprod) {
            var overprodvol = item.overprod * order.fill / 1000;
            LOGARR.push(['Serum Premix to Completed from Overprod:', overprodvol]);
            PtoComplete(premixSerum, overprodvol);

            LOGARR.push(['Stimulant Premix to Completed from Overprod:', overprodvol]);
            PtoComplete(premixStimulant, overprodvol);

            var dat1 = {
                production_status: 'Completed',
                final_status: 'Completed',
                movedtoNext: 1,
                Completed: item.Completed,
                CompletionDate: new Date().getTime()
            };
            base.updateData('Orders/' + item.overprodbatch, dat1);
            base.updateData('Production/' + item.overprodbatch, dat1);
        }


        var dat3 = {
            final_status: 'Completed',
            movedtoNext: 1
        };
        base.updateData('Production/' + item.batch, dat3);
        updateAllTabs(item.batch);
    } else if (sheet_name == 'Printing') {
        var packData = getPackagingData(item.packagingType, item.bottles, order.boxname.sku)
        //   var packlabel = packData.packlabel;
        var packink = packData.ink;
        var tube = packData.botperPack;
        var tubes = item.bottles / tube;
        var ink = 0;
        if (!item.ppb) {
            ink = item.bottles * 0.001;
        }
        if (!item.ppp) {
            ink += packink;
        }
        fromReservedtoCompleted("Misc/printing ink", ink);
        LOGARR.push(['Printing ink:', ink]);
        var dat1 = {
            final_status: 'Completed',
            movedtoNext: 1
        };
        base.updateData('Printing/' + item.batch, dat1);
        var dat2 = {
            printing_status: 'Completed',
        };
        base.updateData('Orders/' + item.batch, dat2);
        item.printing_status = 'Completed';
        item.ProductionCompleted = 'Completed';
        item.labeling_status = 'Sent';
        toLabelling(item);
        LOGARR.push(['Sent to Labelling', item.bottles]);
        updateAllTabs(item.batch);
    } else if (sheet_name == 'Labelling') {
        var suffix = item.batch.substr(-1);
        var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;

        var origbots = order.bottles;
        var tominusTUBE = order.backtubed;
        var botQ2 = item.bottles;
        var label = order.botlabelsku;
        Logger.log("THE LABEL IS " + label);
        var packData = getPackagingData(item.packagingType, item.bottles, order.boxname.sku)
        // var packlabel = packData.packlabel;
        var packink = packData.ink;
        var tube = packData.botperPack;
        var boxname = order.boxname.sku;
         var bookletSKU= order.booklet.sku;
        var tubes = botQ2 / tube;
        var box = tubes / packData.divTubesForBox;
        if (tube) {
            if (item.packlabelsku != "" && item.packlabelsku != undefined) {
                LOGARR.push([item.packlabelsku, tubes]);
                fromReservedtoCompleted('Labels/' + item.packlabelsku, tubes);
            }
        }
        LOGARR.push([label, item.bottles]);
        fromReservedtoCompleted('Labels/' + label, item.bottles);
        if (for_branded_stock) {
            toPackaging(item);
        }
        var dat1 = {
            final_status: 'Completed',
            movedtoNext: 1,
            CompletionDate: new Date().getTime(),
        };
        base.updateData('Labelling/' + item.batch, dat1);
        var dat2 = {
            labeling_status: 'Completed',
        };
        base.updateData('Orders/' + item.batch, dat2);
        updateAllTabs(item.batch);

    } else if (sheet_name == 'Packaging') {
        var brandname = getBrandName(order);
        LOGARR.push(['Branded SKU:', brandname]);
        var packData = getPackagingData(item.packagingType, item.bottles, order.boxname.sku)
        //var packlabel = packData.packlabel;
        var packink = packData.ink;
        var tube = packData.botperPack;
        var boxname = order.boxname.sku;
         var bookletSKU= order.booklet.sku;
        var suffix = item.batch.substr(-1);
        var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;
        var tubes = item.bottles / tube;
        var tominBPack = order.backtubed;
        tubes = tubes - tominBPack;
        if (tube != 0) {
            //WITH PACKAGING
            if (for_branded_stock) {
                fromReservedtoCompleted('Packages/' + item.packagingType.sku, tubes);
                LOGARR.push([item.packagingType.sku, tubes]);
                BtoRunningX(brandname, tubes);
                LOGARR.push(['Branded to Running:', tubes]);
            } else {
                var box = tubes / packData.divTubesForBox;
                if (boxname) {
                    fromReservedtoCompleted('Boxes/' + boxname, box);
                    LOGARR.push([boxname, box]);
                }
                if (bookletSKU) {
                    fromReservedtoCompleted('Booklets/' + bookletSKU, box);
                    LOGARR.push([bookletSKU, box]);
                }
                fromReservedtoCompleted('Packages/' + item.packagingType.sku, tubes);
                LOGARR.push([item.packagingType.sku, tubes]);
                BtoCompleteX(brandname, tominBPack);
                LOGARR.push([brandname + 'to Completed:', tominBPack / tube]);
            }
        }

        if (item.usecomb && for_branded_stock) {
            fromReservedtoCompleted("Misc/COMBWHITE", item.combs);
        }

        var dat1 = {
            final_status: 'Completed',
            movedtoNext: 1,
            CompletionDate: new Date().getTime(),
        };
        base.updateData('Packaging/' + item.batch, dat1);
        var dat2 = {
            packaging_status: 'Completed',
            final_status: 'Completed',
            CompletionDate: new Date().getTime(),
        };
        base.updateData('Orders/' + item.batch, dat2);
        updateAllTabs(item.batch);
        updateShippingInformation2(item.batch);
    } else {
        LOGARR.push(["Wrong Sheet", '']);
    }
    return LOGARR;

}