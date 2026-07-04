const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();

// Configurações padrão
app.use(express.json());
app.use(cors()); 

// CAMINHO ABSOLUTO E SEGURO PARA O ARQUIVO JSON
const ARQUIVO_JSON = path.join(__dirname, 'contas.json');

// Faz o Node mostrar o seu HTML automaticamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para ler os usuários existentes
app.get('/usuarios', (req, res) => {
    if (!fs.existsSync(ARQUIVO_JSON)) {
        return res.json({ usuarios: [] });
    }
    fs.readFile(ARQUIVO_JSON, 'utf8', (err, data) => {
        if (err) {
            console.error("Erro ao ler:", err);
            return res.status(500).json({ erro: "Erro ao ler o arquivo" });
        }
        res.json(JSON.parse(data || '{"usuarios":[]}'));
    });
});

// Rota de Cadastro
app.post('/cadastrar', (req, res) => {
    const novoUsuario = req.body;

    // Se o arquivo não existir, cria ele na raiz do projeto de forma síncrona antes de ler
    if (!fs.existsSync(ARQUIVO_JSON)) {
        try {
            fs.writeFileSync(ARQUIVO_JSON, JSON.stringify({ usuarios: [] }, null, 4));
        } catch (e) {
            console.error("Erro ao criar arquivo inicial:", e);
            return res.status(500).json({ erro: 'Erro ao inicializar banco de dados.' });
        }
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
                console.error("Erro ao gravar:", err);
                return res.status(500).json({ erro: 'Erro ao salvar no arquivo.' });
            }
            res.json({ sucesso: true });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SISTEMA RODANDO NA PORTA ${PORT}`);
});
