import {Injectable} from '@angular/core';

@Injectable()
export class MultiplayerService {
    socket : any;
    
    constructor() {
        //create socket io connection https://spellsnap.herokuapp.com/ || http://localhost:3000
        this.socket = io("https://spellsnap.herokuapp.com"); 
        
        //listen for events
        this.socket.on("connect", () => {
            console.log("Connected to Game Server");
        });
        this.socket.on("disconnect", () => {
            console.log("Disconnected from Game Server");
        });
    }
    
    test(){
        return "Exists";
    }
}