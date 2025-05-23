import './Home.css';
import { Link } from 'react-router-dom';
import logoLetto from './LogoLetto.png';
import logoBagno from './LogoBagno.png';
import logoCucina from './LogoCucina.png';
import logoSala from './LogoSala.png'; 
import Meteo from '../../Components/Meteo/Meteo';

function Home() {
  return (
    <>
      <h1>Domotic House</h1>
      <div className="home-layout">
        <Meteo />
        <div className="weather-card casa" style={{Heigth: "20vh"}}>
          <Link to="/stanza" className="stanza weather-card">
            <img src={logoLetto} alt="Stanza" />
            <p>Stanza</p>
          </Link>
          <Link to="/bagno" className="stanza weather-card">
            <img src={logoBagno} alt="Bagno" />
            <p>Bagno</p>
          </Link>
          <Link to="/cucina" className="stanza weather-card">
            <img src={logoCucina} alt="Cucina" />
            <p>Cucina</p>
          </Link>
          <Link to="/salotto" className="stanza weather-card">
            <img src={logoSala} alt="Salotto" />
            <p>Salotto</p>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
