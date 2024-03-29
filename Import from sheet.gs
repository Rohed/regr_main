function myFunction() {
    var data = getQTY('UnbrandedTypes');
    var pages = [];
    var i, j, temparray, chunk = 500;
    for (i = 0, j = data[0].length; i < j; i += chunk) {
        temparray = data[0].slice(i, i + chunk);
        // do whatever
        pages.push(temparray);
    }
    return pages;
}

function deleteSheet() {
    base.removeData('Orders');
}

function importBottles() {
    var id = '1-WoYSiAUpnEJipjDktr2JyoydsjOZqSkN3TT-YWfD1M';
    var data = SpreadsheetApp.openById(id).getSheetByName('Sheet1').getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {}
}

function getFromSheetRecipes() {
    var id = '1WBYmW-OrQj5G9LTj2J9VINUM-T_6gx0QzqPbolXJ7p4';
    var data = SpreadsheetApp.openById(id).getSheetByName('Sheet1').getDataRange().getValues();
    for (var i = 13; i < data.length; i++) {
        var disp = data[i][0].split(' ');
        var name = {
            vgint: parseInt(disp[2], 10),
            pgint: parseInt(disp[4], 10),
            nicint: parseInt(disp[7].replace('MG', '').replace(':', ''), 10),
            nicorec: parseInt(data[i][3], 10),
            Flavrec: parseInt(data[i][4], 10),
            vgrec: parseInt(data[i][1], 10),
            pgrec: parseInt(data[i][2], 10),
            type: 'nic'
        };
        // generateForSingleRecipe(name);
    }
}

function Import_new_FBC() {
    base.removeData('Brands');
    var id = '1SN1WWN9Xc8-sLIGUErzGk2Bu3FHKc3qmL67HLOLqsiM';
    var ss = SpreadsheetApp.openById(id);
    var data = ss.getSheetByName('Sheet1').getDataRange().getDisplayValues();
    var options1 = '{';
    for (var i = 1; i < data.length; i++) {
        //Get Flavour
        // var flavourandrecipe=data[i][0];
        //  flavourandrecipe=flavourandrecipe.split(' - ');
        var flavour = data[i][1].replace(/&/g, '').replace('&', '').replace('/', '').replace('(', '').replace(')', '').replace(/\./g, '');
        /*
           var brand = data[i][2];
                var t2 = brand.split(' - ');
                   if (t2.length > 1) {
                       brand = t2[0];
                   }*/
        var sku = 'BRA' + getRandom() + flavour.substr(0, 1);
        var dat1 = {
            sku: sku,
            name: flavour,
            /*   Running:0,
                Reserved:0,
                Completed:0,
                Stock:0*/
        };
        options1 += '"' + flavour + '":' + JSON.stringify(dat1) + ',';
    }
    options1 += '}';
    var upload = JSON.parse(options1);
    base.updateData('Brands', upload)
}

function TESTQTY() {
    var id = '11fCoEZYTvbEDiSjxlhn4yxswRme2PyFGCbYKrSe5mX0';
    QTYInport(id)
}

function QTYInport(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import QTY',
        batch: 'Spreadsheet',
        page: 'QTY',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    LOGDATA.data.push('Sheet ID:', id);
    var faileditems = '';
    var newitems = '';
    // id='1sWqguyu1TsaGgxKAo6zzDYCwQg-FkGIA_57P7J8L7WA';
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = id;
    var sheets = [
        ['Flavours', 'Flavours', 'FLAV', 'float'],
        ['Packages', 'Packages', 'PAC', 'int'],
        ['Boxes', 'Boxes', 'BOX', 'int'],
        ['Booklets', 'Booklets', 'BOOK', 'int'],
        ['Labels', 'Labels', 'LAB', 'int'],
        ['Colors', 'Color', 'COL', 'float'],
        ['Premix', 'PremixesTypes', 'GBMIX', 'float'],
        ['Unbranded', 'UnbrandedTypes', 'UB', 'int'],
        ['Branded', 'BrandedTypes', 'BRA', 'int'],
        ['Bottles', 'BottleTypes', 'BOT', 'int'],
        ['Caps', 'Lids', 'CAP', 'int']
    ];
    for (var s = 0; s < sheets.length; s++) {
        try {
            var flavours = ss.getSheetByName(sheets[s][0]);
            if (flavours) {
                flavours = flavours.getDataRange().getValues();
                var origflavours = base.getData(sheets[s][1]);
                if (!origflavours) {
                    origflavours = {};
                }
                var origFlavoursString = JSON.stringify(origflavours);
                for (var i = 1; i < flavours.length; i++) {
                    var replace = false;
                    if (flavours[i][4]) {
                        if (flavours[i][4].toLowerCase() == 'replace') {
                            replace = true;
                        }
                    }
                    try {
                        var flav = flavours[i][1];
                        if (!flavours[i][3]) {
                            flavours[i][3] = sheets[s][2] + getRandom() + flav.substr(0, 1);
                        }
                        if (!flav) {
                            try {
                                flav = origflavours[flavours[i][3]].name;
                            } catch (e) {
                                faileditems += sheets[s][0] + ' SKU is not in the database: ' + flavours[i][3] + '<br/>'
                            }
                        }
                        var foundSKU = origflavours[flavours[i][3]];
                        if (foundSKU) {
                            if (sheets[s][3] == 'float') {
                                if (foundSKU.Running) {
                                    foundSKU.Running = parseFloat(foundSKU.Running) + parseFloat(flavours[i][2])
                                } else {
                                    foundSKU.Running = parseFloat(flavours[i][2])
                                }
                            } else {
                                if (foundSKU.Running) {
                                    foundSKU.Running = parseInt(foundSKU.Running, 10) + parseInt(flavours[i][2], 10);
                                } else {
                                    foundSKU.Running = parseInt(flavours[i][2], 10)
                                }
                            }
                            if (replace) {
                                if (sheets[s][3] == 'float') {
                                    foundSKU.Running = parseFloat(flavours[i][2]);
                                } else {
                                    foundSKU.Running = parseInt(flavours[i][2], 10);
                                }
                            }
                            origflavours[foundSKU.sku] = foundSKU;
                        } else if (flav) {
                            foundSKU = {};
                            foundSKU.name = flav;
                            foundSKU.sku = flavours[i][3];
                            if (sheets[s][3] == 'float') {
                                foundSKU.Running = parseFloat(flavours[i][2]);
                            } else {
                                foundSKU.Running = parseInt(flavours[i][2], 10);
                            }
                            origflavours[foundSKU.sku] = foundSKU;
                            newitems += 'Updated SKU for: ' + flav + ' to ' + flavours[i][3] + '<br>';
                        } else if (flavours[i][3]) {
                            foundSKU = {};
                            foundSKU.name = "None";
                            foundSKU.sku = flavours[i][3];
                            if (sheets[s][3] == 'float') {
                                foundSKU.Running = parseFloat(flavours[i][2]);
                            } else {
                                foundSKU.Running = parseInt(flavours[i][2], 10);
                            }
                            //  base.updateData(sheets[s][1]+'/' + dat1.sku, dat1);
                            // generateForSingleFlavour(flav);
                            origflavours[foundSKU.sku] = foundSKU;
                            newitems += 'Added New ' + sheets[s][1] + ': ' + flav + '<br>';
                        }
                    } catch (e) {
                        faileditems += 'Couldnt proccess ' + flav + ' - ' + flavours[i][3] + "  " + e.toString() + '<br/>';
                    }
                }
                base.updateData(sheets[s][1], origflavours)
                LOGDATA.data.push(['Imported:', sheets[s][1]]);
            }
        } catch (e) {
            LOGDATA.data.push(['Failed To Import:', sheets[s][1]]);
            faileditems += 'Couldnt Upload ' + sheets[s][1] + '.   ' + e.toString() + '<br/>';
        }
    }
    var text = newitems + '<br/>' + faileditems;
    LOGDATA.msg = text;
    logItem(LOGDATA);
    return text;
}

function delsht() {
    base.removeData('BrandedTypes')
}



function MANUALcreateRefferenceDB() {
    var id = '1pONQ9usFnKUnsoMzFkjz8pM41-7llpLJsL-JPasVTd4';
    createRefferenceDB(id)
}

function createRefferenceDB(id) {
    // base.removeData('References');
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import PC/PD',
        batch: 'Spreadsheet',
        page: 'PC/PD',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1pcHJxFnwUVD8Wvgw6c_VvUsy2dKefx-FhJS_WNI_5iY';
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getId();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var payload = {
        'data': JSON.stringify(data),
        'id': id.toString(),
    };
    var params = {
        method: "POST",
        "Content-Type": 'application/json',
        muteHttpExceptions: true,
        'payload': payload,
    }
    var url = SERVER_URL + NODE_PATH + '/createrefferencedb';
    var response = UrlFetchApp.fetch(url, params).getContentText();
    LOGDATA.msg = response;
    logItem(LOGDATA);
    return response;
}


function updatebotlid() {
    var bottles = JSONtoARR(base.getData('BottleTypes'));
    var Caps = JSONtoARR(base.getData('Lids'));
    var pc = JSONtoARR(base.getData('References/ProductCodes')); 
    for (var j = 0; j < pc.length; j++) {
        for (var i = 0; i < Caps.length; i++) {
            if (Caps[i].name == pc[j].lid) {
                pc[j].lidSKU = Caps[i].sku;
                break;
            }
        }
    }
    for (var j = 0; j < pc.length; j++) {
        for (var i = 0; i < bottles.length; i++) {
            if (bottles[i].name == pc[j].btype) {
                pc[j].botSKU = bottles[i].sku;
                break;
            }
        }
    }
   
    var options1 = '{';
    var options2 = '{';
    for (var i = 0; i < pc.length; i++) {
        options1 += '"' + pc[i].prod + '":' + JSON.stringify(pc[i]) + ',';
    }

    options1 += '}';
    options2 += '}';
    var ob1 = JSON.parse(options1);
    // base.removeData('References');
    base.updateData('References/ProductCodes', ob1);
}

function importRecipesFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Recipes',
        batch: 'Spreadsheet',
        page: 'Recipes',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    for (var i = 1; i < data.length; i++) {
        var id = data[i][0];
        var name = data[i][1];
        if (id == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][16] == 'Y') {
            base.removeData('Recipes/' + id);
            base.removeData('Recipes/' + id);
            LOGDATA.data.push(['Removed:', id]);
            continue;
        }
        var VGrec = data[i][2];
        var AGrec = data[i][3];
        var PGrec = data[i][4];
        var Nicorec = data[i][5];
        var Nicorecsalts = data[i][6];
        var cbdrec = data[i][7];
        var MCTrecipe = data[i][8];
        var Flavrec = data[i][9];
        var vg = data[i][10];
        var pg = data[i][11];
        var strength = data[i][12];
        var ColorName = data[i][13];
        var ColorSKU = data[i][14];
        var ColorVal = data[i][15];
        if (VGrec == '') {
            VGrec = 0;
        }
        if (PGrec == '') {
            PGrec = 0;
        }
        if (Nicorec == '') {
            Nicorec = 0;
        }
        if (cbdrec == '') {
            cbdrec = 0;
        }
        if (Flavrec == '') {
            Flavrec = 0;
        }
        if (MCTrecipe == '') {
            MCTrecipe = 0;
        }
        if (AGrec == '') {
            AGrec = 0;
        }
        var recipe = {
            id: id,
            name: name,
            VGrec: VGrec,
            AGrec: AGrec,
            PGrec: PGrec,
            Nicorec: Nicorec,
            Nicorecsalts: Nicorecsalts,
            cbdrec: cbdrec,
            MCTrecipe: MCTrecipe,
            Flavrec: Flavrec,
            vg: vg,
            pg: pg,
            strength: strength,
            Color: {
                name: '',
                sku: '',
                val: '',
            },
        }
        if (ColorName && ColorName && ColorName) {
            recipe.Color.name = ColorName;
            recipe.Color.sku = ColorSKU;
            recipe.Color.val = ColorVal;
        } else {
            delete recipe.Color;
        }
        options += '"' + recipe.id + '":' + JSON.stringify(recipe) + ',';
        LOGDATA.data.push(['Added:', id + ' - ' + name]);
        LOGDATA.msg += 'Added ' + id + '- ' + name + ' \n ';
    }
    options += '}';
    try {
        var upload = JSON.parse(options);
        base.updateData('Recipes', upload);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}

function importBoxesFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Boxes',
        batch: 'Spreadsheet',
        page: 'Boxes',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','divTubesForBox'];
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    var origItems = base.getData('Boxes');
    if (!origItems) {
        origItems = {};
    }
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][3] == 'Y') {
            base.removeData('Boxes/' + sku);
            delete origItems[sku];
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
        var divTubesForBox = data[i][2];
        var box = {
            sku: sku,
            name: name,
            divTubesForBox: divTubesForBox,
            Running: 0,
            Reserved: 0,
            Completed: 0,
        };
        if (!origItems[sku]) {
            origItems[sku] = box;
        } else {
            origItems[sku].name = name;
            origItems[sku].divTubesForBox = divTubesForBox;
        }
        options += '"' + box.sku + '":' + JSON.stringify(box) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    options += '}';
    try {
        var upload = JSON.parse(options);
        base.updateData('Boxes', origItems);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}
function importBookletsFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Booklets',
        batch: 'Spreadsheet',
        page: 'Booklets',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','divTubesForBox'];
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    var origItems = base.getData('Booklets');
    if (!origItems) {
        origItems = {};
    }
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][2] == 'Y') {
            base.removeData('Booklets/' + sku);
            delete origItems[sku];
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
    
        var booklet = {
            sku: sku,
            name: name, 
            Running: 0,
            Reserved: 0,
            Completed: 0,
        };
        if (!origItems[sku]) {
            origItems[sku] = booklet;
        } else {
            origItems[sku].name = name; 
        }
        options += '"' + booklet.sku + '":' + JSON.stringify(booklet) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    options += '}';
    try {
        var upload = JSON.parse(options);
        base.updateData('Booklets', origItems);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}
function cliearItems() {
    var id = '1QyZ2Epsq_MfhAhA43NCi4JDB_ymzgb0j2jKwHlu5Ac0';
    importPackagesFromSheet(id)
}

function importPackagesFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Packages',
        batch: 'Spreadsheet',
        page: 'Packages',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','botperPack',
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    var origItems = base.getData('Packages');
    if (!origItems) {
        origItems = {};
    }
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][3] == 'Y') {
            base.removeData('Packages/' + sku);
            delete origItems[sku];
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
        var botperPack = data[i][2];
        var pack = {
            sku: sku,
            name: name,
            botperPack: botperPack,
            Running: 0,
            Reserved: 0,
            Completed: 0,
        }
        if (!origItems[sku]) {
            origItems[sku] = pack;
        } else {
            origItems[sku].name = name;
            origItems[sku].botperPack = botperPack;
        }
        options += '"' + pack.sku + '":' + JSON.stringify(pack) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    options += '}';
    var msg = '';
    try {
        var upload = JSON.parse(options);
        base.updateData('Packages', origItems);
        msg = LOGDATA.msg;
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        msg = LOGDATA.msg;
        logItem(LOGDATA);
    }
    return msg;
}

function importFlavoursFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Flavours',
        batch: 'Spreadsheet',
        page: 'Flavours',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','botperPack'
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    var origItems = base.getData('Flavours');
    if (!origItems) {
        origItems = {};
    }
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][2] == 'Y') {
            base.removeData('Flavours/' + sku);
            delete origItems[sku];
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
        var flav = {
            sku: sku,
            name: name,
            Running: 0,
            Reserved: 0,
            Completed: 0,
        }
        if (!origItems[sku]) {
            origItems[sku] = flav;
        } else {
            origItems[sku].name = name;
        }
        options += '"' + flav.sku + '":' + JSON.stringify(flav) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    options += '}';
    try {
        var upload = JSON.parse(options);
        base.updateData('Flavours', origItems);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + ' - ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}

function importBottlesFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Bottles',
        batch: 'Spreadsheet',
        page: 'Bottles',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','botperPack'
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    //  var options = "{";
    var origItems = base.getData('BottleTypes');
    if (!origItems) {
        origItems = {};
    }
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][2] == 'Y') {
            base.removeData('BottleTypes/' + sku);
            delete origItems[sku];
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
        var bottle = {
            sku: sku,
            name: name,
            Running: 0,
            Reserved: 0,
            Completed: 0,
        }
        if (!origItems[sku]) {
            origItems[sku] = bottle;
        } else {
            origItems[sku].name = name;
        }
        //  options += '"' + bottle.sku + '":' + JSON.stringify(bottle) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    //options += '}';
    try {
        //   var upload = JSON.parse(options);
        base.updateData('BottleTypes', origItems);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}

function importLidsFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Caps',
        batch: 'Spreadsheet',
        page: 'Caps',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','botperPack'
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    var origItems = base.getData('Lids');
    if (!origItems) {
        origItems = {};
    }
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][2] == 'Y') {
            base.removeData('Lids/' + sku);
            delete origItems[sku];
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
        var lid = {
            sku: sku,
            name: name,
            Running: 0,
            Reserved: 0,
            Completed: 0,
        }
        if (!origItems[sku]) {
            origItems[sku] = lid;
        } else {
            origItems[sku].name = name;
        }
        options += '"' + lid.sku + '":' + JSON.stringify(lid) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    options += '}';
    try {
        var upload = JSON.parse(options);
        base.updateData('Lids', origItems);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}

function importLabelsFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Labels',
        batch: 'Spreadsheet',
        page: 'Labels',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','botperPack'
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    var origItems = base.getData('Labels');
    if (!origItems) {
        origItems = {};
    }
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][2] == 'Y') {
            base.removeData('Labels/' + sku);
            delete origItems[sku];
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
        var label = {
            sku: sku,
            name: name,
            Running: 0,
            Reserved: 0,
            Completed: 0,
        }
        if (!origItems[sku]) {
            origItems[sku] = label;
        } else {
            origItems[sku].name = name;
        }
        options += '"' + label.sku + '":' + JSON.stringify(label) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    options += '}';
    try {
        var upload = JSON.parse(options);
        base.updateData('Labels', origItems);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}

function importColorsFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Colors',
        batch: 'Spreadsheet',
        page: 'Colors',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','botperPack'
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    var origItems = base.getData('Color');
    if (!origItems) {
        origItems = {};
    }
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][2] == 'Y') {
            base.removeData('Color/' + sku);
            delete origItems[sku];
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
        var color = {
            sku: sku,
            name: name,
            Running: 0,
            Reserved: 0,
            Completed: 0,
        }
        if (!origItems[sku]) {
            origItems[sku] = color;
        } else {
            origItems[sku].name = name;
        }
        options += '"' + color.sku + '":' + JSON.stringify(color) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    options += '}';
    try {
        var upload = JSON.parse(options);
        base.updateData('Color', origItems);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}

function importBrandsFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Brands',
        batch: 'Spreadsheet',
        page: 'Brands',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','botperPack'
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][2] == 'Y') {
            base.removeData('Brands/' + sku);
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
        var brand = {
            sku: sku,
            name: name,
        }
        options += '"' + brand.sku + '":' + JSON.stringify(brand) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    options += '}';
    try {
        var upload = JSON.parse(options);
        base.updateData('Brands', upload);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}

function importCustomersFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Customers',
        batch: 'Spreadsheet',
        page: 'Customers',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','botperPack'
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][3] == 'Y') {
            base.removeData('Customers/' + sku);
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
        var address = data[i][2];
        var cust = {
            sku: sku,
            name: name,
            address: address,
        }
        options += '"' + cust.sku + '":' + JSON.stringify(cust) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    options += '}';
    try {
        var upload = JSON.parse(options);
        base.updateData('Customers', upload);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}

function importFlavourMixFromSheet(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Flavour Mixes',
        batch: 'Spreadsheet',
        page: 'Flavour Mixes',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    //id = '1n83FCqn4cSH5GQWDJ4BpuSuU7lOzURrXi-a807M4Wck';
    //  var keys=['sku','name','botperPack'
    var ss = SpreadsheetApp.openById(id);
    LOGDATA.batch = ss.getName();
    var data = ss.getSheets()[0].getDataRange().getValues();
    var options = "{";
    for (var i = 1; i < data.length; i++) {
        var sku = data[i][0];
        var name = data[i][1];
        if (sku == '') {
            LOGDATA.data.push(['Failed - NO ID:', name]);
            LOGDATA.msg += 'Failed - NO ID: ' + name + '\n';
            continue;
        }
        if (data[i][5] == 'Y') {
            base.removeData('FlavourMixes/' + name);
            base.removeData('FlavourMixes/' + name);
            LOGDATA.data.push(['Removed:', sku]);
            continue;
        }
        var flavourNames = data[i][2].split(',');
        var flavourSKUs = data[i][3].split(',');
        var flavourVals = data[i][4].split(',');
        var options2 = "{";
        for (var j = 0; j < flavourNames.length; j++) {
            var item = {
                sku: flavourSKUs[j],
                name: flavourNames[j],
                val: flavourVals[j],
            }
            options2 += '"' + item.sku + '":' + JSON.stringify(item) + ',';
        }
        options2 += '}';
        var flavours = JSON.parse(options2);
        var flavmix = {
            sku: sku,
            name: name,
            flavours: flavours,
        }
        options += '"' + flavmix.sku + '":' + JSON.stringify(flavmix) + ',';
        LOGDATA.data.push(['Added:', sku + ' - ' + name]);
        LOGDATA.msg += 'Added ' + sku + '- ' + name + ' \n ';
    }
    options += '}';
    try {
        var upload = JSON.parse(options);
        base.updateData('Customers', upload);
        logItem(LOGDATA);
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
    }
    return LOGDATA.msg;
}

function importPCPD() {
    //  base.removeData('References');
    var secret2 = '2Ue42tEo5yfjkZn6Fd6NB4eNygOEGJPXjcjxGy2d';
    var config2 = {
        apiKey: "AIzaSyAbjFGr0HjZDmM3ybZLzy_u8yyjv2ePe8Q",
        authDomain: "gbvco-vape-factory-solution.firebaseapp.com",
        databaseURL: "https://gbvco-vape-factory-solution.firebaseio.com/",
        projectId: "gbvco-vape-factory-solution",
        storageBucket: "gbvco-vape-factory-solution.appspot.com",
        messagingSenderId: "164416568407"
    };
    var base2 = FirebaseApp.getDatabaseByUrl(config2.databaseURL, secret2);
    var data = base2.getData('References');
    base.updateData('References', data);
}
//IMPORT BLANK PCPD
function importBlankPCPC(id) {
    var premixARR = [];
    var unbrandedARR = [];
    var linkedBBARR = [];
    var sheet = SpreadsheetApp.openById(id).getSheets()[0];
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {}
}

function TESTIMPORTINVENTORY() {
    var id = '1NmTf01sdtsYrr4kBLNu7vcv6TAg7dF3OtY5AlcdQBQk';
    importInventoryData(id)
}

function importInventoryData(id) {
    var LOGDATA = {
        status: true,
        msg: '',
        action: 'Import Inventory',
        batch: 'Spreadsheet',
        page: 'Inventory',
        user: Session.getActiveUser().getEmail(),
        data: new Array()
    };
    try {
        var pages = ['Misc',  'Labels', 'Boxes', 'Booklets', 'Packages',  'BottleTypes', 'Lids', 'PremixesTypes',  'BrandedTypes'];
        var ss = SpreadsheetApp.openById(id);
        LOGDATA.batch = ss.getName();
        var data = ss.getSheets()[0].getDataRange().getDisplayValues();
        for (var i = 1; i < data.length; i++) {
          var orderdate = data[i][2] ? data[i][2].toString().split('/') : false;
          if(orderdate){
            orderdate = new Date(orderdate[1]+'/'+orderdate[0]+'/'+orderdate[2]).getTime();
          }
          
          var delivdate = data[i][3] ? data[i][3].toString().split('/') : false;
          if(delivdate){
            delivdate = new Date(delivdate[1]+'/'+delivdate[0]+'/'+delivdate[2]).getTime();
          }
          
          var paiddate = data[i][4] ? data[i][4].toString().split('/') : false;
          if(paiddate){
            paiddate = new Date(paiddate[1]+'/'+paiddate[0]+'/'+paiddate[2]).getTime();
          }
                  
            var obj = {
                sku: data[i][0],
                desc: data[i][1],
                orderdate:orderdate,
                delivdate:delivdate,
                paiddate: paiddate,
                eta: data[i][5],
                quantity: parseFloat(data[i][6]),
                note: data[i][7],
              serumBatchCode:data[i][8],
              stimulantBatchCode:data[i][9],
              
            };
            for (var p = 0; p < pages.length; p++) {
                
              var exists = base.getData(pages[p] + '/' + obj.sku);
              
                if (exists) {
                    obj.page = pages[p];
                    if (!obj.desc) {
                        obj.desc = exists.name;
                    }
                    break;
                }
            }
           if(exists){
            LOGDATA.msg += saveItem(obj) + '\n';
            
            }else{
             LOGDATA.msg += obj.sku +' - '+obj.desc+' Doesnt Exist \n';
            
            }
        }
        logItem(LOGDATA);
        return LOGDATA.msg;
    } catch (e) {
        LOGDATA.status = false;
        LOGDATA.data.push(['FAILED:', e.toString()]);
        LOGDATA.msg = 'Failed ' + e.toString + '- ' + LOGDATA.msg + ' \n ';
        logItem(LOGDATA);
        return LOGDATA.msg;
    }
}

function uniq4(a) {
    var prims = {
            "boolean": {},
            "number": {},
            "string": {}
        },
        objs = [];
    return a.filter(function(item) {
        var type = typeof item[0];
        if (type in prims)
            return prims[type].hasOwnProperty(item[0]) ? false : (prims[type][item[0]] = true);
        else
            return objs.getIndex2(item[0]) >= 0 ? false : objs.push(item);
    });
}
Array.prototype.diff2 = function(arr2) {
    var ret = [];
    var l = this.length;
    for (var i = 0; i < l; i += 1) {
        if (arr2.getIndex(this[i][0])) {
            ret.push(this[i]);
        }
    }
    return ret;
};

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function(e) {
        return b.getIndex(e[0]) > -1;
    });
}

