import { utentiModel, BulbModel } from "./connessione.js";
import { generateToken } from "./token.js";

export const registerUser = async (req, res) => {
  try {
    const { city, email, password } = req.body;

    const existingUser = await utentiModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email già registrata" });
    }

    const nuovoUtente = new utentiModel({ city, email, password });
    await nuovoUtente.save();

    const stanze = ["bagno", "cucina", "stanza", "salotto"];
    const lampadine = stanze.map((stanza) => ({
      userId: nuovoUtente._id,
      stanza,
      acceso: false,
      colore: "#ffffff",
    }));

    await BulbModel.insertMany(lampadine);

    res.status(201).json({
      message: "Registrazione avvenuta con successo e lampadine create",
    });
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    res.status(500).json({ message: "Errore durante la registrazione", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const utente = await utentiModel.findOne({ email });

    if (!utente || !(await utente.matchPassword(password))) {
      return res.status(401).json({ message: "Email o password errata" });
    }

    const token = generateToken(utente);
    res.json({ message: "Login riuscito", token });
  } catch (error) {
    console.error("Errore durante il login:", error);
    res.status(500).json({ message: "Errore durante il login", error: error.message });
  }
};
