const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();

// Configurações padrão
app.use(express.json());
app.use(cors()); 

const ARQUIVO_JSON = 'contas.json';

// FAZ O NODE MOSTRAR O SEU HTML AUTOMATICAMENTE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para ler os usuários existentes
app.get('/usuarios', (req, res) => {
    if (!fs.existsSync(ARQUIVO_JSON)) {
        return res.json({ usuarios: [] });
    }
    fs.readFile(ARQUIVO_JSON, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ erro: "Erro ao ler o arquivo" });
        res.json(JSON.parse(data || '{"usuarios":[]}'));
    });
});

// Rota de Cadastro
app.post('/cadastrar', (req, res) => {
    const novoUsuario = req.body;

    if (!fs.existsSync(ARQUIVO_JSON)) {
        fs.writeFileSync(ARQUIVO_JSON, JSON.stringify({ usuarios: [] }, null, 4));
    }

    fs.readFile(ARQUIVO_JSON, 'utf8', (err, data) => {
        let json = { usuarios: [] };

        if (!err && data) {
            try {
                json = JSON.parse(data);
            } catch (e) {
                json = { usuarios: [] };
            }
        }

        json.usuarios.push(novoUsuario);

        fs.writeFile(ARQUIVO_JSON, JSON.stringify(json, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao salvar no arquivo.' });
            }
            res.json({ sucesso: true });
        });
    });
});

app.listen(3000, () => {
    console.log('🔥 SISTEMA RODANDO! Acesse no navegador: http://localhost:3000');
});