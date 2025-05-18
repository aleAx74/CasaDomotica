import { BulbModel } from './connessione.js';


export const cambiaStato = async  (req, res) => {
  const stanza = req.params.stanza;
  const { acceso, colore } = req.body;
  const userId = req.user.id;
  try {
    const bulb = await BulbModel.findOne({ stanza, userId: userId });
    if (!bulb) return res.status(404).json({ error: "Lampadina non trovata" });

    bulb.acceso = typeof acceso === "boolean" ? acceso : bulb.acceso;
    bulb.colore = colore || bulb.colore;

    await bulb.save();

    res.status(200).json({ message: "Lampadina aggiornata", bulb });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore interno nel aggiornamento lampadina" });
  }
}

export const ottieniStato = async (req, res) => {
  const stanza = req.params.stanza;
  const userId = req.user.id;

  try {
const bulb = await BulbModel.findOne({stanza, userId: userId
});
    if (!bulb) return res.status(404).json({ error: "Lampadina non trovata" });

    const { acceso, colore } = bulb;
    res.status(200).json({ acceso, colore });
  } catch (error) {
    res.status(500).json({ error: "Errore interno nel recupero lampadina" });
  }
}