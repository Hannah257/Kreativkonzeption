import { createServer } from "http";
import { Server } from "socket.io";
const io = new Server("'http://localhost:3000'");
const socket = server.io;

function makeid(length: any){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwqyz0123456789';
    for ( var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    
    }
    return result;
}
const state = new Map<any, any>();
const clientRooms = new Map<string, any>()
export let clientNumber: any;

const gameScreen: HTMLElement = document.getElementById('gameScreen') as HTMLElement;
const initialScreen: HTMLElement = document.getElementById('initialScreen') as HTMLElement;
const newGameButton: HTMLElement = document.getElementById('newGameButton') as HTMLElement;
const joinGameButton: HTMLElement = document.getElementById('joinGameButton') as HTMLElement;
const invitationCodeInput: HTMLInputElement = document.getElementById('invitationCode') as HTMLInputElement;

newGameButton.addEventListener('click', newGame);
joinGameButton.addEventListener('click', joinGame);


const httpServer= createServer()
export const io= new Server(httpServer);

io.on('connection', (client:any) => {

    client.on('newGame', handleNewGame);
    client.on('joinGame', handleJoinGame);


    function handleJoinGame(gameCode: any) {
        io.sockets.adapter.rooms.get(gameCode)
        const room: any= io.sockets.adapter.rooms.get(gameCode);

        let allUsers;
        if(room) {
            allUsers = room.sockets;
        }

        let numClients = 0;
        if (allUsers) {
            numClients = Object.keys(allUsers).length;
        }

         clientRooms.set(client.id, gameCode);

         client.join(gameCode);
         clientNumber = 2;
         client.emit('init', 2)

    }

    function handleNewGame(){
        let roomName = makeid(5);
        clientRooms.set(client.id, roomName);
        client.emit('gameCode', roomName);

        state.set(roomName, initGame());

        client.join(roomName);
        clientNumber = 1;
        client.emit('init', 1);
    }

});

function joinGame (){
    const gameCode = invitationCodeInput.value;
    socket.emit('joinGame', gameCode);
    initGame();
}

function newGame (){
    socket.emit('newGame');
    initGame();
}

function initGame  (){
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";
}


io.listen(3000);