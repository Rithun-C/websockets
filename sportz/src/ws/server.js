import {WebSocket, WebSocketServer} from 'ws';

function sendJson(socket, payload){
    if(socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload){
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;
        sendJson(client, payload);
    }
}

 export function attachWsServer(server){
    const wss = new WebSocketServer({
        server, path : '/ws', maxPayload : 1024 * 1024
    })

    wss.on('connection', (socket) =>{        
        socket.isAlive = true;
        socket.on('pong', () => { socket.isAlive = true; });
        sendJson(socket, {type : 'welcome'})
        socket.on('error', console.error)
    })

    const heartbeatInterval = setInterval(() => {        
        wss.clients.forEach((socket) => {    
            if (!socket.isAlive) return socket.terminate();            
            socket.isAlive = false;            
            socket.ping();        
        });}, 30000);    
        
    wss.on('close', () => clearInterval(heartbeatInterval));

    function broadcastMatchCreated(match){
        broadcast(wss, {type : 'match_created', data : match});
    }

    return { broadcastMatchCreated };
 }
