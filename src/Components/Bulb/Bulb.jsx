import { useState, useEffect } from 'react';
import './Bulb.css';
import { useLocation } from "react-router-dom";

function Bulb() {
  const [isOn, setIsOn] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const location = useLocation();
  const stanza = location.pathname.split("/")[1];
  const url = `https://casadomotica-service.onrender.com/api/bulb/${stanza}`;
  const token = localStorage.getItem('token');

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleToggle = async () => {
    const newState = !isOn;
    setIsOn(newState);
    await fetch(url, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ acceso: newState, colore: color })
    });
  };

  useEffect(() => {
    const fetchBulbState = async () => {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const { acceso, colore } = await res.json();
      setIsOn(acceso);
      if (colore) setColor(colore);
    };
    if (token) fetchBulbState();
  }, [url, token]);

  useEffect(() => {
    document.body.style.background = isOn ? "#ffffff9a" : "#1a1a1a58";
    return () => {
      document.body.style.background = '';
    };
  }, [isOn]);

  useEffect(() => {
    if (!isOn || !token) return;

    const timeout = setTimeout(() => {
      fetch(url, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ acceso: isOn, colore: color })
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [color, isOn, url, token]);

  const bulbStyle = {
    '--bulb-color': isOn ? color : '#444',
  };

  return (
    <div className={`App ${isOn ? 'on' : ''}`}>
      <div className="bulb" style={bulbStyle}>
        <span></span>
        <span></span>
      </div>
      <div className="wire"></div>
      <div className="switch" onClick={handleToggle}>
        <div className={`btn ${isOn ? 'on' : ''}`}></div>
      </div>
      <div className="controls">
        <label>
          Imposta il colore della luce: <br /><br />
          <input type="color" value={color} onChange={handleColorChange} />
        </label>
      </div>
    </div>
  );
}

export default Bulb;
