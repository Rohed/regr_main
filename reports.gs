function getArea(item) {
  var fill = item.fill.toString();

  if (item.CBDrecipe && fill == '10') {
    return 'Semi Auto';
  }
  if (fill == '10') {
    return 'Shortfill Room';
  }

  return 'Mixing Room';
}
function getOrderIDsReporting(){

 var params = {
        orderBy: 'final_status',
        equalTo: "all",

    }
  

   var data=searchFor([['Orders', params]])[1].filter(function(item){ return item.orderID}).sort(sortOrderIDs);
   
   return data;

}
function getReportingData(){
var orderIDs = uniq(getOrderIDsReporting().map(function(item){return item.orderID})).filter(function(item){return item});

return orderIDs;
}

function testCreateOrdersReport(){
  var reportType = 'shippingsummary';
  
      switch (reportType){
      case 'orders':
          var data = {
            orderIDs:["INV-00011059"]
          }
      var report =  createOrdersReport(data, 'Orders Report','orders')
      break;
      case 'shipping':
        var data = {
            orderIDs:["INV-00011059"],
            shippingdates:[0,new Date().getTime()]
          }
      var report =  createOrdersReport(data, 'Shipping Report','shipping')
      break;
      default:
          var data = {
           shippingdates:[new Date().getTime()-(60*60*1000*24*20),new Date().getTime()]
            
          }
      var report =  createOrdersReport(data, 'Shipping Summary','shippingsummary')
          
      }
Logger.log(report);
}

function ttestGETReport(){
  
 getReport('shipping')
}
function getReport(type){

  var url = SERVER_URL + NODE_PATH + '/getreport?report='+type;
  var response = UrlFetchApp.fetch(url).getContentText();
 
  while(!response){
  Utilities.sleep(800);
    var response = UrlFetchApp.fetch(url).getContentText();
 
  }
 var resp = JSON.parse(response);
return resp;

}


function createOrdersReport(data,reportName,reportType){

   var payload = {
        'data': JSON.stringify(data),
    };
      var params = {
            method: "POST",
            "Content-Type": 'application/json',
        muteHttpExceptions: true,
        'payload': payload,
    }
    switch (reportType){
      case 'orders':
          var url = SERVER_URL + NODE_PATH + '/createordersreport';
      break;
      case 'shipping':
          var url = SERVER_URL + NODE_PATH + '/createshippingreport';
      break;
      default:
          var url = SERVER_URL + NODE_PATH + '/createshippingsummary';
      
      }

    var response = UrlFetchApp.fetch(url, params).getContentText();
    
    var report  = getReport(reportType);
 
   var formattedDate = Utilities.formatDate(new Date(), "GMT","dd-MM-yyyy");
  var folder=DriveApp.getFolderById(REPORTS_FOLDER);
  var create=DriveApp.getFileById(REPORTS_TEMPLATE).makeCopy(reportName+' - '+formattedDate,folder);
  var SS=SpreadsheetApp.openById(create.getId());

  var sheet = SS.getSheetByName(reportName);

  
  if(reportType == 'orders'){
    sheet.getRange(2, 4).setValue(report.total.notstarted);
    sheet.getRange(2, 5).setValue(report.total.started);
    sheet.getRange(2, 6).setValue(report.total.completed);
    sheet.getRange(2, 7).setValue(report.total.total);
    var keys= Object.keys(report.proccessObj);
    var values = [];
    
    for(var i = 0 ; i < keys.length;i++){
    var item = report.proccessObj[keys[i]];
    values.push([item.orderID,item.customer,item.brand,item.notstarted,item.started,item.completed,item.total,Math.floor((new Date().getTime() - item.orderdate )/24/60/60/1000),formatDateDisplay(item.orderdate),item.completed/item.total  * 100,(item.total/item.completed == 1 ? "Complete" : "Incomplete")])
    
    }
    if(values.length > 0 ){
      sheet.getRange(5, 1, values.length, values[0].length).setValues(values)
    }
  }else if(reportType == 'shipping'){
 
    sheet.getRange(1, 5).setValue(report.total.total);
    var keys= Object.keys(report.proccessObj);
    var values = [];
    
    for(var i = 0 ; i < keys.length;i++){
    var item = report.proccessObj[keys[i]];
    values.push([item.dateshipped,item.customer,item.orderID,item.SHIPPINGCODE,item.total])
    
    }
    if(values.length > 0 ){
      sheet.getRange(4, 1, values.length, values[0].length).setValues(values)
    }
  
  }else{
  
      sheet.getRange(1, 5).setValue(report.total.total);
    var keys= Object.keys(report.proccessObj);
    var values = [];
    
    for(var i = 0 ; i < keys.length;i++){
    var item = report.proccessObj[keys[i]];
    values.push([item.dateshipped,item.total,item['Mixing Room'],item['Semi Auto'],item['Shortfill Room'], item["N/A"]])
    
    }
    if(values.length > 0 ){
      sheet.getRange(5, 1, values.length, values[0].length).setValues(values)
    }
  
  }
    var sheets= SS.getSheets();
  sheets.map(function(item){
    if(item.getName() != reportName){
      SS.deleteSheet(item);
    }
  });
return {name:SS.getName(),url:SS.getUrl()} 
 
}