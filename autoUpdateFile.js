

function autoUpdateFile(){
//日付計算
 var now = new Date();
 var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
 var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);  
 var strYesterday = Utilities.formatDate(yesterday, "JST", "yyyy/MM/dd");

 var condition = "FAXが添付されてるんですよ has:attachment";  //特定の名前添付あり
 var sheet = SpreadsheetApp.getActiveSheet();
 var lastRow = sheet.getLastRow(); 
 var idArrays = sheet.getRange(`E2:E${lastRow}`).getValues();
 var flattenArray = idArrays.flat(); 
 var arrays = [];

 var search_mail = GmailApp.search(condition);
 var messages = GmailApp.getMessagesForThreads(search_mail);
 console.log(messages);
  //https://drive.google.com/drive/folders/146Ks_UY-HbniuiZaw0ljk-Mlb__FqUIZ
 var hozon_folder = DriveApp.getFolderById('146Ks_UY-HbniuiZaw0ljk-Mlb__FqUIZ');
 for(var i = 0; i < messages.length; i++) { //検索結果を一つずつ取り出す
   for(var j = 0; j < messages[i].length; j++) { //スレッドが連なる場合はここを複数回実行
     var attach = messages[i][j].getAttachments();
     var day = messages[i][j].getDate(); //取り出したメールの日付を取得
     var strDay = Utilities.formatDate(day , "JST", "yyyy_MM_dd");
     //if (day > today){ //★★メールが今日以降か再度チェック

     //}
    console.log(messages[i][j].getPlainBody())
    var msgId = messages[i][j].getId();
    console.log(msgId)
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
        "hoge",
        "fuga",
        "piyo",
        messages[i][j].getId()
      ]; 
      console.log(row);
      arrays.push(row);    
    }
   }
   messages[i][0].markRead();
 }
  if(arrays.length > 0){
    SpreadsheetApp.getActiveSheet().getRange(`A${lastRow + 1}:E${lastRow + arrays.length}`).setValues(arrays);
  }
}