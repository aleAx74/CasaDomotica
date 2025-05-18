import express from 'express';
import cors from 'cors';
import { registerUser, loginUser } from './utenti.js';
import { protect } from './token.js';
import { cambiaStato, ottieniStato} from './bulb.js';
const app = express();

app.use(cors({origin: []}));
app.use(express.json());

app.post('/api/register', registerUser);
app.post('/api/login', loginUser);

app.put("/api/bulb/:stanza", protect, cambiaStato);

app.get("/api/bulb/:stanza", protect, ottieniStato);


app.listen(5000, ()=>{
  console.log("server in ascolto");
})