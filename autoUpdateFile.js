function autoUpdateFile(){
 var searchText = "Attached Image has:attachment";
 var sheet = SpreadsheetApp.getActiveSheet();
 var lastRow = sheet.getLastRow();
 var idArrays = sheet.getRange(`B2:B${lastRow}`).getValues();
 var flattenArray = idArrays.flat(); 
 var arrays = [];
 var driveId = "146Ks_UY-HbniuiZaw0ljk-Mlb__FqUIZ"//「https://drive.google.com/drive/folders/**********************」の***の部分

 var start = 0;	
 var max = 10;
 var threads = GmailApp.search(searchText, start, max);
 var messages = GmailApp.getMessagesForThreads(threads);

 var hozon_folder = DriveApp.getFolderById(driveId);
 for(var i = 0; i < messages.length; i++) { 
   for(var j = 0; j < messages[i].length; j++) { 
     var attach = messages[i][j].getAttachments();
     var day = messages[i][j].getDate();
     var strDay = Utilities.formatDate(day , "JST", "yyyy_MM_dd");
    var msgId = messages[i][j].getId();
    if(flattenArray.includes(msgId) == false){
       //ファイル追加
       for(var k = 0; k < attach.length; k++){
         var filename = strDay + '_' + attach[k].getName();
         hozon_folder.createFile(attach[k]);
         var file = hozon_folder.getFilesByName(attach[k].getName())
         file.next().setName(filename);
       }
      
      var row = [
        messages[i][j].getDate(),
        messages[i][j].getId()
      ]; 
      arrays.push(row);    
    }
   }
   messages[i][0].markRead();
 }
  if(arrays.length > 0){
    SpreadsheetApp.getActiveSheet().getRange(`A${lastRow + 1}:B${lastRow + arrays.length}`).setValues(arrays);
  }
}
