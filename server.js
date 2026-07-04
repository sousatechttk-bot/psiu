const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors()); 

// BANCO DE DADOS EM MEMÓRIA (Funciona 100% na nuvem gratuita)
let usuariosCadastrados = [];

// Abre o seu HTML automaticamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota que entrega a lista de usuários para o painel ADM
app.get('/usuarios', (req, res) => {
    res.json({ usuarios: usuariosCadastrados });
});

// Rota que cadastra um novo usuário
app.post('/cadastrar', (req, res) => {
    try {
        const novoUsuario = req.body;
        
        // Salva direto na memória do servidor
        usuariosCadastrados.push(novoUsuario);
        
        console.log(`[SUCESSO] Usuário @${novoUsuario.usuario} salvo na memória.`);
        res.json({ sucesso: true });
    } catch (error) {
        console.error("Erro interno:", error);
        res.status(500).json({ erro: 'Erro ao processar o cadastro.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SISTEMA ONLINE NA PORTA ${PORT}`);
});
