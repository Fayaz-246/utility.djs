import exp from 'express';
import Client from './utilityClient'

interface DashOps {
    Client: Client;
    Port?: number;
}

export default class Dash {
 constructor(obj: DashOps) {
    if(!obj.Port) obj.Port = 8080;

    if(!obj.Client.isReady()) throw new Error("This class should be used after the bot is online [UTILITY.DJS]"); 
    let app = exp();

    app.get('/', (req, res) => {
        res.send(`Hmmm lets see if ${obj.Client.user?.username} is online :D`)
      })
      
      app.listen(obj.Port, () => {
        console.log(`Example app listening on port http://localhost:${obj.Port}/`)
      })
      
 }   
}