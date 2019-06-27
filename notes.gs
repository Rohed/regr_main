
function saveNote(orderID,noteText,selPage){
try{
  var notesFull =  base.getData('Notes/'+orderID);
  var now = new Date().getTime();
  if(!notesFull){
    notesFull = {
      orderID:orderID,
      timestamp:now,
      selPage:selPage,
      user:Session.getActiveUser().getEmail(),
      notes:{}
    }
    
  }
  
  var note = {
    orderID:orderID,
    text:noteText,
    timestamp:now,
    selPage:selPage,
    user:Session.getActiveUser().getEmail(),
  }
  notesFull.notes[now] = note;
  
  base.updateData('Notes/'+orderID,notesFull);
  return [notesFull,"Note Saved",false];
  }catch(e){
  
  return [{},"Failed to save note.",true];
  }
}

function getNotesList(){
  var notes = base.getData('Notes') || {};
  var orderIDs = getOrderIDs('priority');
  var notesArr = orderIDs.map(function(item){
    return notes[item[1]] ? [notes[item[1]].orderID,notes[item[1]].timestamp,notes[item[1]].notes] : [item[1],'',{}]
  });
 return [notesArr,'notesModal']
}

function getNotesObj(){
  var notes = base.getData('Notes') || {};

 return notes
}