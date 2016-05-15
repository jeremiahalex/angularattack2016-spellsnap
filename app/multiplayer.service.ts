import {Injectable} from '@angular/core';

@Injectable()
export class MultiplayerService {
    socket : any;
    grid : any;
    players : any;
    rank : any;
    playerId : string;
    timeLeft : number;
    
    gridCallback : Function;
    updateCallback : Function;
    letterAcceptedCallback : Function;
    letterRejectedCallback : Function;
    playersCallback : Function;
    rankCallback : Function;
    claimAcceptedCallback : Function;
    claimRejectedCallback : Function;
    timeUpdatedCallback : Function;
    
    
    constructor() {
        this.grid = [];
        this.playerId = "";
        
        //create socket io connection
        if (document.location.hostname == "localhost")
            this.socket = io("http://localhost:3000");
        else 
            this.socket = io("https://spellsnap.herokuapp.com");
        
        //listen for events
        this.socket.on("connect", () => {
            console.log("Connected to Game Server");
        });
        this.socket.on("disconnect", () => {
            console.log("Disconnected from Game Server");
        });
        
        this.socket.on("grid", (grid) => {
            console.log("Received grid ", grid);
            this.grid = grid;
            if ( this.gridCallback ) this.gridCallback(this.grid);
        });
        
        this.socket.on("players", (players) => {
            console.log("Received players ", players);
            this.players = players;
            if ( this.playersCallback ) this.playersCallback(this.players);
        });
        
        this.socket.on("rank", (rank) => {
            console.log("Received rank ", rank);
            this.rank = rank;
            if ( this.rankCallback ) this.rankCallback(this.rank);
        });
        
        this.socket.on("playerId", (playerId) => {
            console.log("Received playerId ", playerId);
            this.playerId = playerId;
        });
        
        this.socket.on("time", (timeLeft) => {
            console.log("Received time ", timeLeft);
            this.timeLeft = timeLeft;
            if ( this.timeUpdatedCallback ) this.timeUpdatedCallback(timeLeft);
        });
        
        this.socket.on("update", (update) => {
            console.log("Received update ", update);
            if ( this.updateCallback ) this.updateCallback(update);
            //TODO. if we don't have a callback we need to handle this differently as the grid will be out of sync
            //options include asking for the grid again or storing these in an array. A timestamp may help to differentiate
            //observe problem first before fixing
        });
        
        this.socket.on("letterAccepted", (pack) => {
            console.log("letterAccepted ", pack);
            if ( this.letterAcceptedCallback ) this.letterAcceptedCallback(pack);
        });
        
        this.socket.on("letterRejected", (pack) => {
            console.log("letterRejected ", pack);
            if ( this.letterRejectedCallback ) this.letterRejectedCallback(pack);
        });
        
        
        this.socket.on("claimAccepted", (pack) => {
            console.log("claimAccepted ", pack);
            if ( this.claimAcceptedCallback ) this.claimAcceptedCallback(pack);
        });
        
        this.socket.on("claimRejected", (pack) => {
            console.log("claimRejected ", pack);
            if ( this.claimRejectedCallback ) this.claimRejectedCallback(pack);
        });
    }
    
    //we register callbacks for each socket event, we could use observables I suppose but too tired to work that out
    registerCallbacks( gridCallback, updateCallback, letterAcceptedCallback, letterRejectedCallback, playersCallback, rankCallback
    , claimAcceptedCallback, claimRejectedCallback, timeUpdatedCallback ) {
        this.gridCallback = gridCallback;
        this.updateCallback = updateCallback;
        this.letterAcceptedCallback = letterAcceptedCallback;
        this.letterRejectedCallback = letterRejectedCallback;
        this.playersCallback = playersCallback;
        this.rankCallback = rankCallback;
        this.claimAcceptedCallback = claimAcceptedCallback;
        this.claimRejectedCallback = claimRejectedCallback;
        this.timeUpdatedCallback = timeUpdatedCallback; 
        //we may already have the grid, if so return it, so they can begin the game
        if ( this.grid && this.grid.length > 0 ) this.gridCallback(this.grid);
    }
    
    addLetter( x:number, y:number, letter:string ) {
        var pack = { x: x, y: y, letter: letter };
        console.log("Attempting to add letter: ", pack );
        this.socket.emit("addLetter", pack );
    }
    
    claimWord( x:number, y:number, cells:any, score:number ) {
        var pack = { x: x, y: y, cells: cells, score: score };
        console.log("Attempting to claim word: ", pack );
        this.socket.emit("claimWord", pack );
    }
    
    sendStats( score:number, currentLetter:string ) {
        var pack = { score: score, currentLetter: currentLetter };
        console.log("Attempting to send stats: ", pack );
        this.socket.emit("stats", pack );
    }
}