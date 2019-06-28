function testCheckStock(){
var batches = ['915346B','913605'];
checkStockValues(batches)
}
function checkStockValues(BATCHES) {
    var failMSG = '';
    Logger.log(BATCHES);
    var results = [];
    /*ar BATCHES = [901007, 901014, 901018, 901028, 901033, 901055, 901057, 901069, 901074, 901111, 901120, 901126,
     901145, 901153, 901157, 901174, 901183, 901186, 901188, 901189, 901196, 901206, 901214, 901224, 901227,
     901260, 901261, 901266, 901280, 901283, 901287, 901288, 901296, 901318, 901334, 901342, 901344, 901346, 901354, 901371, 901374, 901409, 901412, 901421, 901426];
       */
    //  BATCHES=['322231S'];
    //BATCHES=['901517', '901282', '901684', '901685', '901283', '901351', '901284', '901518'];
    var requiredCombs = 0;
    var requiredLids = 0;
    var requiredBottles = 0;
    var requiredTubes = 0;
    var requiredPremix = 0;
    var requiredBoxes = 0;
    var requiredPacks = 0;
    var availableCombs = 0;
    var availableLids = 0;
    var availableBottles = 0;
    var availablePremix = 0;
    var availableBoxes = 0;
    var availablePacks = 0;
    var LidsArr = [];
    var PremixArr = [];
    var BottlesArr = [];
    var TubesArr = [];
    var BoxesArr = [];
    var PackedArr = [];
    var BoxArr = [];
    var PacksArr = [];
    var LabelsArr = [];
    var InkArr = [];
    var OrigInkArr = [];
    var OrigPacksArr = [];
    var OrigLabelsArr = [];
    var OrigBoxArr = [];
    var OrigPmixArr = [];
    var OrigBottlesArr = [];
    var OrigTubesArr = [];
    var OrigBoxesArr = [];
    var OrigPackedArr = [];
    var OrigLidsArr = [];
    var OrigPackedArr = [];
  
  var CombsCheck = base.getData('Misc/COMBWHITE');
    for (var i = 0; i < BATCHES.length; i++) {
        try {
            var data = base.getData('Orders/' + BATCHES[i]);
            var suffix = data.batch.substr(-1);
            if (suffix == 'B') {
                generateForSingleBrand2(data.productcode, data.productdescription);
                var packink = 0;
                var packData = getPackagingData(data.packagingType, data.bottles, data.boxname.sku)
                var packink = packData.ink;
                var tube = packData.botperPack;
                var boxname = data.boxname.sku;
                var Packs = data.bottles / tube;
                var box = Packs / packData.divTubesForBox;
                var PacksCheck = base.getData("Packages/" + data.packagingType.sku);
                var exists3 = OrigPacksArr.getIndex(data.packagingType.sku);
                if (exists3 == -1) {
                    OrigPacksArr.push([data.packagingType.sku, PacksCheck.Running]);
                    exists3 = OrigPacksArr.getIndex(data.packagingType.sku);
                }
                var PackOBJ = checkALL(OrigPacksArr[exists3][1], Packs);
                OrigPacksArr[exists3][1] = PackOBJ.running;
                var exists2 = PacksArr.getIndex(data.packagingType.sku);
                if (exists2 == -1) {
                    PacksArr.push([data.packagingType.sku, PackOBJ.used, PackOBJ.left, Packs])
                } else {
                    PacksArr[exists2][1] += PackOBJ.used;
                    PacksArr[exists2][2] += PackOBJ.left;
                    PacksArr[exists2][3] += Packs;
                }
                if (data.packlabelsku != "" && data.packlabelsku != undefined) {
                    var LabelsCheck = base.getData("Labels/" + data.packlabelsku);
                    if (!LabelsCheck) {
                        var LabelsCheck = {
                            Running: 0
                        };
                    }
                    var exists3 = OrigLabelsArr.getIndex(data.packlabelsku);
                    if (exists3 == -1) {
                        OrigLabelsArr.push([data.packlabelsku, LabelsCheck.Running]);
                        exists3 = OrigLabelsArr.getIndex(data.packlabelsku);
                    }
                    var LabelOBJ = checkALL(OrigLabelsArr[exists3][1], Packs);
                    OrigLabelsArr[exists3][1] = LabelOBJ.running;
                    var exists2 = LabelsArr.getIndex(data.packlabelsku);
                    if (exists2 == -1) {
                        LabelsArr.push([data.packlabelsku, LabelOBJ.used, LabelOBJ.left, Packs])
                    } else {
                        LabelsArr[exists2][1] += LabelOBJ.used;
                        LabelsArr[exists2][2] += LabelOBJ.left;
                        LabelsArr[exists2][3] += Packs;
                    }
                }
                var ink = 0;
                if (data.ppb) {
                    ink += data.bottles * 0.001;
                }
                if (data.ppb) {
                    ink += packink;
                }
                var InkCheck = base.getData("Misc/printing ink");
                var exists3 = OrigInkArr.getIndex('printing ink');
                if (exists3 == -1) {
                    OrigInkArr.push(['printing ink', InkCheck.Running]);
                    exists3 = OrigInkArr.getIndex('printing ink');
                }
                var InkOBJ = checkALL(OrigInkArr[exists3][1], ink);
                OrigInkArr[exists3][1] = InkOBJ.running;
                var exists2 = InkArr.getIndex('printing ink');
                if (exists2 == -1) {
                    InkArr.push(['printing ink', InkOBJ.used, InkOBJ.left, ink])
                } else {
                    InkArr[exists2][1] += InkOBJ.used;
                    InkArr[exists2][2] += InkOBJ.left;
                    InkArr[exists2][2] += ink;
                }
                var label = data.botlabelsku;
                var LabelsCheck = base.getData("Labels/" + label);
                if (!LabelsCheck) {
                    var LabelsCheck = {
                        Running: 0
                    };
                }
                var exists3 = OrigLabelsArr.getIndex(label);
                if (exists3 == -1) {
                    OrigLabelsArr.push([label, LabelsCheck.Running]);
                    exists3 = OrigLabelsArr.getIndex(label);
                }
                var LabelOBJ = checkALL(OrigLabelsArr[exists3][1], data.bottles);
                OrigLabelsArr[exists3][1] = LabelOBJ.running;
                var exists2 = LabelsArr.getIndex(label);
                if (exists2 == -1) {
                    LabelsArr.push([label, LabelOBJ.used, LabelOBJ.left, data.bottles])
                } else {
                    LabelsArr[exists2][1] += LabelOBJ.used;
                    LabelsArr[exists2][2] += LabelOBJ.left;
                    LabelsArr[exists2][3] += data.bottles;
                }
                var premix = getPremixSKU(data,'Serum');
                var premixCheck = base.getData("PremixesTypes/" + premix);
                if (!premixCheck) {
                    var premixCheck = {
                        Running: 0
                    };
                }
                var exists1 = OrigPmixArr.getIndex(premix);
                if (exists1 == -1) {
                    OrigPmixArr.push([premix, premixCheck.Running]);
                    exists1 = OrigPmixArr.getIndex(premix);
                }
                var pmixOBJ = checkALL(OrigPmixArr[exists1][1], data.QTY);
                OrigPmixArr[exists1][1] = pmixOBJ.running;
                var exists2 = PremixArr.getIndex(premix);
                if (exists2 == -1) {
                    PremixArr.push([premix, pmixOBJ.used, pmixOBJ.left, data.QTY])
                } else {
                    PremixArr[exists2][1] += pmixOBJ.used;
                }
                
              var premix = getPremixSKU(data,'Stimulant');
              var premixCheck = base.getData("PremixesTypes/" + premix);
              if (!premixCheck) {
                var premixCheck = {
                  Running: 0
                };
              }
              var exists1 = OrigPmixArr.getIndex(premix);
              if (exists1 == -1) {
                OrigPmixArr.push([premix, premixCheck.Running]);
                exists1 = OrigPmixArr.getIndex(premix);
              }
              var pmixOBJ = checkALL(OrigPmixArr[exists1][1], data.QTY);
              OrigPmixArr[exists1][1] = pmixOBJ.running;
              var exists2 = PremixArr.getIndex(premix);
              if (exists2 == -1) {
                PremixArr.push([premix, pmixOBJ.used, pmixOBJ.left, data.QTY])
              } else {
                PremixArr[exists2][1] += pmixOBJ.used;
              }
              
                        
                var LidCheck = base.getData("Lids/" + data.lidSKU);
                if (!LidCheck) {
                    var LidCheck = {
                        Running: 0
                    };
                }
                var exists3 = OrigLidsArr.getIndex(data.lidSKU);
                if (exists3 == -1) {
                    OrigLidsArr.push([data.lidSKU, LidCheck.Running]);
                    exists3 = OrigLidsArr.getIndex(data.lidSKU);
                }
                var LidOBJ = checkALL(OrigLidsArr[exists3][1], data.bottles);
                OrigLidsArr[exists3][1] = LidOBJ.running;
                var exists2 = LidsArr.getIndex(data.lidSKU);
                if (exists2 == -1) {
                    LidsArr.push([data.lidSKU, LidOBJ.used, LidOBJ.left, data.bottles])
                } else {
                    LidsArr[exists2][1] += LidOBJ.used;
                    LidsArr[exists2][2] += LidOBJ.left;
                    LidsArr[exists2][3] += data.bottles;
                }
                var BottleCheck = base.getData("BottleTypes/" + data.botSKU);
                if (!BottleCheck) {
                    var BottleCheck = {
                        Running: 0
                    };
                }
                var exists3 = OrigBottlesArr.getIndex(data.botSKU);
                if (exists3 == -1) {
                    OrigBottlesArr.push([data.botSKU, BottleCheck.Running]);
                    exists3 = OrigBottlesArr.getIndex(data.botSKU);
                }
                var BotOBJ = checkALL(OrigBottlesArr[exists3][1], data.bottles);
                OrigBottlesArr[exists3][1] = BotOBJ.running;
                var exists2 = BottlesArr.getIndex(data.botSKU);
                if (exists2 == -1) {
                    BottlesArr.push([data.botSKU, BotOBJ.used, BotOBJ.left, data.bottles])
                } else {
                    BottlesArr[exists2][1] += BotOBJ.used;
                    BottlesArr[exists2][2] += BotOBJ.left;
                    BottlesArr[exists2][3] += data.bottles;
                }
                var TubeCheck = base.getData("BottleTypes/" + data.tubeSKU);
                if (!TubeCheck) {
                    var TubeCheck = {
                        Running: 0
                    };
                }
                var exists3 = OrigTubesArr.getIndex(data.tubeSKU);
                if (exists3 == -1) {
                    OrigTubesArr.push([data.tubeSKU, TubeCheck.Running]);
                    exists3 = OrigBottlesArr.getIndex(data.tubeSKU);
                }
                var TubeOBJ = checkALL(OrigTubesArr[exists3][1], data.bottles);
                OrigTubesArr[exists3][1] = TubeOBJ.running;
                var exists2 = TubesArr.getIndex(data.tubeSKU);
                if (exists2 == -1) {
                    TubesArr.push([data.tubeSKU, TubeOBJ.used, TubeOBJ.left, TubeOBJ.bottles])
                } else {
                    TubesArr[exists2][1] += BotOBJ.used;
                    TubesArr[exists2][2] += BotOBJ.left;
                    TubesArr[exists2][3] += data.bottles;
                }
              
              if(data.usecomb){
                requiredCombs += data.combs;
              }
            } else {
                generateForSingleBrand2(data.productcode, data.productdescription);
                
                var brandname = getBrandName(data);
                var packData = getPackagingData(data.packagingType, data.bottles, data.boxname.sku)
                var packink = packData.ink;
                var tube = packData.botperPack;
                var boxname = data.boxname.sku;
                var Packs = data.bottles / tube;
                var box = Packs / packData.divTubesForBox;
                var brandedstockP = base.getData('BrandedTypes/' + brandname);
                if (boxname) {
                    var BoxCheck = base.getData("Boxes/" + boxname);
                    var exists3 = OrigBoxArr.getIndex(boxname);
                    if (exists3 == -1) {
                        OrigBoxArr.push([boxname, BoxCheck.Running]);
                    }
                    exists3 = OrigBoxArr.getIndex(boxname);
                    var BoxOBJ = checkALL(OrigBoxArr[exists3][1], box);
                    OrigBoxArr[exists3][1] = BoxOBJ.running;
                    var exists2 = BoxArr.getIndex(boxname);
                    if (exists2 == -1) {
                        BoxArr.push([boxname, BoxOBJ.used, BoxOBJ.left, box])
                    } else {
                        BoxArr[exists2][1] += BoxOBJ.used;
                        BoxArr[exists2][2] += BoxOBJ.left;
                        BoxArr[exists2][3] += box;
                    }
                }
                var exists1 = OrigPackedArr.getIndex(brandname);
                if (exists1 == -1) {
                    OrigPackedArr.push([brandname, brandedstockP.Running]);
                    exists1 = OrigPackedArr.getIndex(brandname);
                }
                var PBBOBJ = checkALL(OrigPackedArr[exists1][1], Packs);
                OrigPackedArr[exists1][1] = PBBOBJ.running;
                var exists2 = PackedArr.getIndex(premix);
                if (exists2 == -1) {
                    PackedArr.push([brandname, PBBOBJ.used, 0])
                } else {
                    PackedArr[exists2][1] += PBBOBJ.used;
                }
                if (PBBOBJ.left > 0) {
                    data.bottles = PBBOBJ.left * tube;
                    
                        var packink = 0;
                        if (data.packagingType.sku) {
                            var packData = getPackagingData(data.packagingType, data.bottles, data.boxname.sku)
                            var packink = packData.ink;
                            var tube = packData.botperPack;
                            var boxname = data.boxname.sku;
                            var Packs = data.bottles / tube;
                            var box = Packs / packData.divTubesForBox;
                            var PacksCheck = base.getData("Packages/" + data.packagingType.sku);
                            if (!PacksCheck) {
                                var PacksCheck = {
                                    Running: 0
                                };
                            }
                            var exists3 = OrigPacksArr.getIndex(data.packagingType.sku);
                            if (exists3 == -1) {
                                OrigPacksArr.push([data.packagingType.sku, PacksCheck.Running]);
                                exists3 = OrigPacksArr.getIndex(data.packagingType.sku);
                            }
                            var PacksOBJ = checkALL(OrigPacksArr[exists3][1], Packs);
                            OrigPacksArr[exists3][1] = TubeOBJ.running;
                            var exists2 = PacksArr.getIndex(data.packagingType.sku);
                            if (exists2 == -1) {
                                PacksArr.push([data.packagingType.sku, PacksOBJ.used, PacksOBJ.left, Packs])
                            } else {
                                PacksArr[exists2][1] += PacksOBJ.used;
                                PacksArr[exists2][2] += PacksOBJ.left;
                                PacksArr[exists2][3] += Packs;
                            }
                            if (data.packlabelsku != "" && data.packlabelsku != undefined) {
                                var LabelsCheck = base.getData("Labels/" + data.packlabelsku);
                                if (!LabelsCheck) {
                                    var LabelsCheck = {
                                        Running: 0
                                    };
                                }
                                var exists3 = OrigLabelsArr.getIndex(data.packlabelsku);
                                if (exists3 == -1) {
                                    OrigLabelsArr.push([data.packlabelsku, LabelsCheck.Running]);
                                    exists3 = OrigLabelsArr.getIndex(data.packlabelsku);
                                }
                                var LabelOBJ = checkALL(OrigLabelsArr[exists3][1], Packs);
                                OrigLabelsArr[exists3][1] = LabelOBJ.running;
                                var exists2 = LabelsArr.getIndex(data.packlabelsku);
                                if (exists2 == -1) {
                                    LabelsArr.push([data.packlabelsku, LabelOBJ.used, LabelOBJ.left, Packs])
                                } else {
                                    LabelsArr[exists2][1] += LabelOBJ.used;
                                    LabelsArr[exists2][2] += LabelOBJ.left;
                                    LabelsArr[exists2][3] += Packs;
                                }
                            }
                        }
                        var ink = 0;
                        if (data.ppb) {
                            ink += data.bottles * 0.001;
                        }
                        if (data.ppb) {
                            ink += packink;
                        }
                        var InkCheck = base.getData("Misc/printing ink");
                        var exists3 = OrigInkArr.getIndex('printing ink');
                        if (exists3 == -1) {
                            OrigInkArr.push(['printing ink', InkCheck.Running]);
                            exists3 = OrigInkArr.getIndex('printing ink');
                        }
                        var InkOBJ = checkALL(OrigInkArr[exists3][1], ink);
                        OrigInkArr[exists3][1] = InkOBJ.running;
                        var exists2 = InkArr.getIndex('printing ink');
                        if (exists2 == -1) {
                            InkArr.push(['printing ink', InkOBJ.used, InkOBJ.left, ink])
                        } else {
                            InkArr[exists2][1] += InkOBJ.used;
                            InkArr[exists2][2] += InkOBJ.left;
                            InkArr[exists2][2] += ink;
                        }
                        var label = data.botlabelsku;
                        var LabelsCheck = base.getData("Labels/" + label);
                        if (!LabelsCheck) {
                            var LabelsCheck = {
                                Running: 0
                            };
                        }
                        var exists3 = OrigLabelsArr.getIndex(label);
                        if (exists3 == -1) {
                            OrigLabelsArr.push([label, LabelsCheck.Running]);
                            exists3 = OrigLabelsArr.getIndex(label);
                        }
                        var LabelOBJ = checkALL(OrigLabelsArr[exists3][1], data.bottles);
                        OrigLabelsArr[exists3][1] = LabelOBJ.running;
                        var exists2 = LabelsArr.getIndex(label);
                        if (exists2 == -1) {
                            LabelsArr.push([label, LabelOBJ.used, LabelOBJ.left, data.bottles])
                        } else {
                            LabelsArr[exists2][1] += LabelOBJ.used;
                            LabelsArr[exists2][2] += LabelOBJ.left;
                            LabelsArr[exists2][3] += data.bottles;
                        }
                        var premix = getPremixSKU(data,'Serum');
                        var premixCheck = base.getData("PremixesTypes/" + premix);
                        if (!premixCheck) {
                            var premixCheck = {
                                Running: 0
                            };
                        }
                        var exists1 = OrigPmixArr.getIndex(premix);
                        if (exists1 == -1) {
                            OrigPmixArr.push([premix, premixCheck.Running]);
                            exists1 = OrigPmixArr.getIndex(premix);
                        }
                        var pmixOBJ = checkALL(OrigPmixArr[exists1][1], data.QTY);
                        OrigPmixArr[exists1][1] = pmixOBJ.running;
                        var exists2 = PremixArr.getIndex(premix);
                        if (exists2 == -1) {
                            PremixArr.push([premix, pmixOBJ.used, pmixOBJ.left, data.QTY])
                        } else {
                            PremixArr[exists2][1] += pmixOBJ.used;
                        }
                        
                          var premix = getPremixSKU(data,'Stimulant');
                        var premixCheck = base.getData("PremixesTypes/" + premix);
                        if (!premixCheck) {
                            var premixCheck = {
                                Running: 0
                            };
                        }
                        var exists1 = OrigPmixArr.getIndex(premix);
                        if (exists1 == -1) {
                            OrigPmixArr.push([premix, premixCheck.Running]);
                            exists1 = OrigPmixArr.getIndex(premix);
                        }
                        var pmixOBJ = checkALL(OrigPmixArr[exists1][1], data.QTY);
                        OrigPmixArr[exists1][1] = pmixOBJ.running;
                        var exists2 = PremixArr.getIndex(premix);
                        if (exists2 == -1) {
                            PremixArr.push([premix, pmixOBJ.used, pmixOBJ.left, data.QTY])
                        } else {
                            PremixArr[exists2][1] += pmixOBJ.used;
                        }
                        
                        
                        var LidCheck = base.getData("Lids/" + data.lidSKU);
                        if (!LidCheck) {
                            var LidCheck = {
                                Running: 0
                            };
                        }
                        var exists3 = OrigLidsArr.getIndex(data.lidSKU);
                        if (exists3 == -1) {
                            OrigLidsArr.push([data.lidSKU, LidCheck.Running]);
                            exists3 = OrigLidsArr.getIndex(data.lidSKU);
                        }
                        var LidOBJ = checkALL(OrigLidsArr[exists3][1], data.bottles);
                        OrigLidsArr[exists3][1] = LidOBJ.running;
                        var exists2 = LidsArr.getIndex(data.lidSKU);
                        if (exists2 == -1) {
                            LidsArr.push([data.lidSKU, LidOBJ.used, LidOBJ.left, data.bottles])
                        } else {
                            LidsArr[exists2][1] += LidOBJ.used;
                            LidsArr[exists2][2] += LidOBJ.left;
                            LidsArr[exists2][3] += data.bottles;
                        }
                        var BottleCheck = base.getData("BottleTypes/" + data.botSKU);
                        if (!BottleCheck) {
                            var BottleCheck = {
                                Running: 0
                            };
                        }
                        var exists3 = OrigBottlesArr.getIndex(data.botSKU);
                        if (exists3 == -1) {
                            OrigBottlesArr.push([data.botSKU, BottleCheck.Running]);
                            exists3 = OrigBottlesArr.getIndex(data.botSKU);
                        }
                        var BotOBJ = checkALL(OrigBottlesArr[exists3][1], data.bottles);
                        OrigBottlesArr[exists3][1] = BotOBJ.running;
                        var exists2 = BottlesArr.getIndex(data.botSKU);
                        if (exists2 == -1) {
                            BottlesArr.push([data.botSKU, BotOBJ.used, BotOBJ.left, data.bottles])
                        } else {
                            BottlesArr[exists2][1] += BotOBJ.used;
                            BottlesArr[exists2][2] += BotOBJ.left;
                            BottlesArr[exists2][3] += data.bottles;
                        }
                        var TubeCheck = base.getData("BottleTypes/" + data.tubeSKU);
                        if (!TubeCheck) {
                            var TubeCheck = {
                                Running: 0
                            };
                        }
                        var exists3 = OrigTubesArr.getIndex(data.tubeSKU);
                        if (exists3 == -1) {
                            OrigTubesArr.push([data.tubeSKU, TubeCheck.Running]);
                            exists3 = OrigBottlesArr.getIndex(data.tubeSKU);
                        }
                        var TubeOBJ = checkALL(OrigTubesArr[exists3][1], data.bottles);
                        OrigTubesArr[exists3][1] = TubeOBJ.running;
                        var exists2 = TubesArr.getIndex(data.tubeSKU);
                        if (exists2 == -1) {
                            TubesArr.push([data.tubeSKU, TubeOBJ.used, TubeOBJ.left, TubeOBJ.bottles])
                        } else {
                            TubesArr[exists2][1] += BotOBJ.used;
                            TubesArr[exists2][2] += BotOBJ.left;
                            TubesArr[exists2][3] += data.bottles;
                        }
                  if(data.usecomb){
                    requiredCombs += data.combs;
                  }
                    }
                 
            }
        } catch (e) {
            failMSG += "Failed for: " + BATCHES[i] + ' Reason: ' + e.toString() + '<br/>';
        }
    }
  var logDATA = [];
  var BottleMSG = 'Bottles: <br>';
  var TubeMSG = 'Tubes: <br>';
  var LidMSG = 'Lids: <br>';
  var PremixMSG = 'Premixes: <br>';
  var PBbottleMSG = 'Packaged Branded Bottles: <br>';
  var BoxMSG = 'Boxes: <br>';
  var LabelMSG = 'Labels: <br>';

   var PackMSG = 'Pack Types: <br>';
    var InkMSG = 'Ink: <br>';
    var CombMSG = 'Combs: <br>';
    /*

     var flavoursArr=[];
     var LidsArr=[];
     var PremixArr=[];
     var BottlesArr=[];
     var UbottlesArr=[];
     var BbottlesArr=[];
     var BoxesArr=[];
     var PackedArr=[];
     var BoxArr=[];
     var PacksArr=[];
     var LabelsArr=[];
     var InkArr=[];

     var OrigInkArr=[];
     var OrigTubesArr=[];
     var OrigLabelsArr=[];
     var OrigBoxArr=[];
     var OrigFlavoursArr=[];
     var OrigPmixArr=[];
     var OrigBottlesArr=[];
     var OrigUbottlesArr=[];
     var OrigBbottlesArr=[];
     var OrigBoxesArr=[];
     var OrigPackedArr=[];
     var OrigLidsArr=[];
     var OrigPackedArr=[];


    */
    var formattedDate = Utilities.formatDate(new Date(), "GMT", "dd-MM-yyyy");
    logDATA.push(['NEW LOG ' + formattedDate, '', '', '', '']);
    logDATA.push(['', '', '', '', '']);
    logDATA.push(['Bottles', '', '', '', '']);
    for (var i = 0; i < BottlesArr.length; i++) {
        var running = base.getData('BottleTypes/' + BottlesArr[i][0]);
        BottleMSG += running.name + ' ' + BottlesArr[i][0] + ":  -   Will Use: " + BottlesArr[i][1] + " - Available: " + running + ' -  Missing: ' + BottlesArr[i][2] + " - Required: " + BottlesArr[i][3] + '<br>';
        logDATA.push([running.name + ' ' + BottlesArr[i][0], BottlesArr[i][1], running.Running, BottlesArr[i][2], BottlesArr[i][3]]);
    }
    
    logDATA.push(['', '', '', '', '']);
    logDATA.push(['Tubes', '', '', '', '']);
    for (var i = 0; i < TubesArr.length; i++) {
        var running = base.getData('BottleTypes/' + TubesArr[i][0]);
        TubeMSG += running.name + ' ' + TubesArr[i][0] + ":  -   Will Use: " + TubesArr[i][1] + " - Available: " + running + ' -  Missing: ' + TubesArr[i][2] + " - Required: " + TubesArr[i][3] + '<br>';
        logDATA.push([running.name + ' ' + TubesArr[i][0], TubesArr[i][1], running.Running, TubesArr[i][2], TubesArr[i][3]]);
    }
    
    logDATA.push(['', '', '', '', '']);
    logDATA.push(['Lids', '', '', '', '']);
    for (var i = 0; i < LidsArr.length; i++) {
        var running = base.getData('Lids/' + LidsArr[i][0]);
        LidMSG += running.name + ' ' + LidsArr[i][0] + ":  -   Will Use: " + LidsArr[i][1] + " - Available: " + running + ' -  Missing: ' + LidsArr[i][2] + " - Required: " + LidsArr[i][3] + '<br>';
        logDATA.push([running.name + ' ' + LidsArr[i][0], LidsArr[i][1], running.Running, LidsArr[i][2], LidsArr[i][3]]);
    }
    logDATA.push(['', '', '', '', '']);
    logDATA.push(['Premixes', '', '', '', '']);
    for (var i = 0; i < PremixArr.length; i++) {
        var running = base.getData('PremixesTypes/' + PremixArr[i][0]);
        PremixMSG += PremixArr[i][0] + '  ' + running.name + ":  -   Will Use: " + PremixArr[i][1] + " - Available: " + running.Running + ' -  Missing: ' + PremixArr[i][2] + '<br>';
        logDATA.push([PremixArr[i][0] + '  ' + running.name, PremixArr[i][1], running.Running, PremixArr[i][2], '']);
    }
    logDATA.push(['Branded', '', '', '', '']);
    for (var i = 0; i < PackedArr.length; i++) {
        var running = base.getData('BrandedTypes/' + PackedArr[i][0]);
        PBbottleMSG += PackedArr[i][0] + '  ' + running.name + ":  -   Will Use: " + PackedArr[i][1] + " - Available: " + running.Running + ' -  Missing: ' + PackedArr[i][2] + '<br>';
        logDATA.push([PackedArr[i][0] + '  ' + running.name, PackedArr[i][1], running.Running, PackedArr[i][2], '']);
    }
    logDATA.push(['', '', '', '', '']);
    logDATA.push(['Pack Types', '', '', '', '']);
    for (var i = 0; i < PacksArr.length; i++) {
        var running = base.getData('Packages/' + PacksArr[i][0]);
        PackMSG += running.name + ' ' + PacksArr[i][0] + ":  -   Will Use: " + PacksArr[i][1] + " - Available: " + running + ' -  Missing: ' + PacksArr[i][2] + " - Required: " + PacksArr[i][3] + '<br>';
        logDATA.push([running.name + ' ' + PacksArr[i][0], PacksArr[i][1], running.Running, PacksArr[i][2], PacksArr[i][3]]);
    }
    logDATA.push(['', '', '', '', '']);
    logDATA.push(['Boxes', '', '', '', '']);
    for (var i = 0; i < BoxArr.length; i++) {
        var running = base.getData('Boxes/' + BoxArr[i][0]);
        BoxMSG += BoxArr[i][0] + ":  -   Will Use: " + BoxArr[i][1] + " - Available: " + running + ' -  Missing: ' + BoxArr[i][2] + " - Required: " + BoxArr[i][3] + '<br>';
        logDATA.push([running.name + ' ' + BoxArr[i][0], BoxArr[i][1], running.Running, BoxArr[i][2], BoxArr[i][3]]);
    }
    logDATA.push(['', '', '', '', '']);
    logDATA.push(['Labels', '', '', '', '']);
    for (var i = 0; i < LabelsArr.length; i++) {
        var running = base.getData('Labels/' + LabelsArr[i][0]);
        LabelMSG += running.name + ' ' + LabelsArr[i][0] + ":  -   Will Use: " + LabelsArr[i][1] + " - Available: " + running + ' -  Missing: ' + LabelsArr[i][2] + " - Required: " + LabelsArr[i][3] + '<br>';
        logDATA.push([running.name + ' ' + LabelsArr[i][0], LabelsArr[i][1], running.Running, LabelsArr[i][2], LabelsArr[i][3]]);
    }
    logDATA.push(['', '', '', '', '']);
    logDATA.push(['Misc', '', '', '', '']);
    for (var i = 0; i < InkArr.length; i++) {
        var running = base.getData('Misc/' + InkArr[i][0] + '/Running');
        InkMSG += InkArr[i][0] + ":  -   Will Use: " + InkArr[i][1] + " - Available: " + running + ' -  Missing: ' + InkArr[i][2] + " - Required: " + InkArr[i][3] + '<br>';
        logDATA.push([InkArr[i][0], InkArr[i][1], running, InkArr[i][2], InkArr[i][3]]);
    }
  
  CombMSG += "Will Use: " + requiredCombs + " - Available: " + availableCombs  + " - Required: " + requiredCombs +'<br>';
  var missing = parseInt(availableCombs, 10) - parseInt(requiredCombs, 10);
  if (missing >= 0) {
    missing = 0;
  } else {
    missing = Math.abs(missing);
  }
  logDATA.push(['Combs', requiredCombs, availableCombs, missing, requiredCombs]);
 
    logDATA.push(['', '', '', '', '']);
    var msg =  BottleMSG + "<hr>" + LidMSG + "<hr>" + PremixMSG + "<hr>"  + PBbottleMSG + "<hr>" + BoxMSG + "<hr>" + LabelMSG + "<hr>" + PackMSG+ "<hr>" + InkMSG + "<hr>" + CombMSG  + "<hr>" + failMSG;
    var sheet = SpreadsheetApp.openById(logSheet).getSheetByName('Sheet1');
    sheet.insertRowsAfter(sheet.getMaxRows(), logDATA.length);
    sheet.getRange(sheet.getLastRow() + 4, 1, 1, 5).setBackground('#D9A744');
    sheet.getRange(sheet.getLastRow() + 4, 1, logDATA.length, 5).setValues(logDATA);
    /* var file=DocumentApp.openById(logFileID);
     
     var text=file.getBody().getText();
     Logger.log(text);
     var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
     text+='\n \n \n'+formattedDate+'\n \n';
     text+=text1;
     var blob=Utilities.newBlob(text);
     blob.setName("Log File");
     
     DriveApp.getFileById(logFileID).setContent(text);


     msg+='<br><hr>'+file.getUrl();*/
     Logger.log(msg);
    return msg;
}

function checkVals(data) {
    var suffix = data.batch.substr(-1);
    var for_premixed_stock = suffix == PREMIX_STOCK_SUFFIX ? true : false;
    var for_unbranded_stock = suffix == UNBRANDED_STOCK_SUFFIX ? true : false;
    if (!for_unbranded_stock) {
        suffix = data.batch.substr(-2);
        for_unbranded_stock = suffix == UNBRANDED_STOCK_SUFFIX2 ? true : false;
    }
    var for_branded_stock = suffix == BRANDED_STOCK_SUFFIX ? true : false;
    if (for_premixed_stock) {
        var forPremix = checkMix(data);
        return forPremix;
    } else if (for_unbranded_stock) {
        var forUnbranded = CheckPremixed2(data);
        return forUnbranded;
    } else if (for_branded_stock) {
        var forBranded = CheckUnbranded2(data);
        return forBranded;
    } else {
        generateForSingleBrand2(data.productcode, data.productdescription);
        var forCustom = CheckBranded2(data);
        return forCustom;
    } //end custom
}

function checkALL(running, needed) {
    var helper1 = running - needed;
    if (running <= 0) {
        var retobj = {
            running: 0,
            used: 0,
            left: needed
        };
    } else if (helper1 == 0) {
        var retobj = {
            running: 0,
            used: needed,
            left: 0
        };
    } else if (helper1 > 0) {
        var retobj = {
            running: helper1,
            used: needed,
            left: 0
        };
    } else if (helper1 < 0) {
        var help2 = needed - running
        var retobj = {
            running: 0,
            used: running,
            left: help2
        };
    }
    return retobj;
}
Array.prototype.getIndex = function(searchValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][0] == searchValue) {
            return i
            break;
        }
    }
    return -1;
};