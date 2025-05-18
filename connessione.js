import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const mongoURI = "mongodb+srv://mongo_alessandro:E1jkbfsFxY5f9b8n@cluster0.7gzgv.mongodb.net/TPSI?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
  .then(() => {
    console.log("Database connesso...");
  })
  .catch((error) => {
    console.log("Errore di connessione:", error);
  });

const userSchema = new mongoose.Schema({
  city: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const BulbSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "utenti", 
    required: true,
  },
  stanza: { type: String, required: true },
  acceso: { type: Boolean, required: true },
  colore: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const utentiModel = mongoose.model("utenti", userSchema);
const BulbModel = mongoose.model("stato_lampadine", BulbSchema);

export { utentiModel, BulbModel };
