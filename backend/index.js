const express = require('express');
const cors = require('cors'); // Importa o pacote 'cors'
const app = express();
const PORT = 3000; // O servidor rodará na porta 3000

// === Middlewares (Filtros) ===

// Habilita o CORS (Cross-Origin Resource Sharing)
// Isso é ESSENCIAL para permitir que seu app Expo (de um IP diferente)
// possa fazer requisições para este servidor.
app.use(cors());

// Habilita o Express para entender JSON no corpo (body) das requisições
app.use(express.json());

// === Nossas Rotas (Endpoints) ===

// Rota 1: Método GET (para testar)
// Quando o app chamar http://SEU_IP:3000/api/hello
app.get('/api/hello', (req, res) => {
  // O servidor imprime no terminal
  console.log('Recebida requisição GET em /api/hello');
  
  // O servidor responde para o app
  res.json({ message: 'Olá do seu backend customizado! (GET)' });
});

// Rota 2: Método POST (para enviar dados)
// Quando o app chamar http://SEU_IP:3000/api/echo
app.post('/api/echo', (req, res) => {
  // O servidor imprime no terminal o que recebeu
  console.log('Recebida requisição POST em /api/echo com o body:', req.body);
  
  // Pega o dado 'data' que o app enviou dentro do 'body'
  const { data } = req.body;
  
  // Se o app não enviou o 'data', retorna um erro
  if (!data) {
    return res.status(400).json({ error: 'Nenhum "data" foi enviado no body.' });
  }

  // O servidor responde para o app com o dado que recebeu
  res.json({ 
    message: 'Seu backend recebeu e está devolvendo:',
    seuDado: data 
  });
});

// === Inicia o Servidor ===

// O servidor "ouve" a porta 3000, aguardando conexões
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
  console.log(`Disponível em: http://localhost:${PORT}`);
});