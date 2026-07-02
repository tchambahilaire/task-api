import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API fonctionne !' });
});

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
