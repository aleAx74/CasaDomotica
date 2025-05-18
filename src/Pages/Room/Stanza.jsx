import React, { useEffect } from 'react';
import { useParams, Navigate  } from 'react-router-dom';
import Bulb from '../../Components/Bulb/Bulb';
import './Stanza.css'

function Stanza() {
  const { nome } = useParams();
  const validRooms = ['bagno', 'stanza', 'cucina', 'sala'];

  
  if (!validRooms.includes(nome)) {
    return <Navigate to="/" />; 
  }
  return (
    <div>
      <h2 style={{position: 'absolute', bottom: '5vh', left: '50%', transform: 'translateX(-50%)'}}>Benvenuto nella stanza: {nome}</h2>
      <Bulb/>
    </div>
  );
}

export default Stanza;
