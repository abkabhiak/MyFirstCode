conMsgPrint=function(msg){
    console.log('message: ' + msg);
  };
conUserConnected=function(){
    console.log('a user connected');
  };
conUserDisconnected=function(){
    console.log('a user Disconnected');
  };
exports.conMsgPrint=conMsgPrint;
exports.conUserDisconnected=conUserDisconnected;
exports.conUserConnected=conUserConnected;
