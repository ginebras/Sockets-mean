var express=require('express');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server,{
	cors:{
		origin:'*'
	}
});

io.on('connection',function(socket){

	var host=socket.handshake.headers.host;
	console.log(socket.handshake.headers.host);
	
	var { nameRoom }=socket.handshake.query;

	socket.join(nameRoom);

	console.log("Se conecto "+host+' a '+nameRoom);

	socket.on('event',res=>{
		socket.to(nameRoom).emit('event',res);
	})
	
})

server.listen(5000,()=>{
	console.log('Conexion al servidor ejecutada');
})
