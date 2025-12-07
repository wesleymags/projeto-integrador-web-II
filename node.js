const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const client = require('./database/conexao'); // Importa o cliente de conexão

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Permite requisições de outras origens (como o frontend)
app.use(bodyParser.json()); // Habilita o parsing de JSON no corpo da requisição

// Importar e usar as rotas (em um arquivo routes/tarefas.js, por exemplo)
// const tarefasRouter = require('./routes/tarefas');
// app.use('/itens', tarefasRouter); 
// Para simplicidade, vamos definir as rotas diretamente aqui (ou em routes/tarefas.js)

// --- Rotas CRUD ---

// GET /itens -> Listar registros
app.get('/itens', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM tarefas ORDER BY criado_em DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao listar itens:', err);
        res.status(500).send('Erro interno do servidor');
    }
});

// POST /itens -> Inserir
app.post('/itens', async (req, res) => {
    const { titulo, descricao, status } = req.body;
    try {
        const text = 'INSERT INTO tarefas(titulo, descricao, status) VALUES($1, $2, $3) RETURNING *';
        const values = [titulo, descricao, status || 'pendente'];
        const result = await client.query(text, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao inserir item:', err);
        res.status(400).send('Dados inválidos ou erro de banco');
    }
});

// PUT /itens/:id -> Atualizar
app.put('/itens/:id', async (req, res) => {
    const id = req.params.id;
    const { titulo, descricao, status } = req.body;
    try {
        const text = 'UPDATE tarefas SET titulo=$1, descricao=$2, status=$3 WHERE id=$4 RETURNING *';
        const values = [titulo, descricao, status, id];
        const result = await client.query(text, values);
        if (result.rowCount === 0) {
            return res.status(404).send('Item não encontrado');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao atualizar item:', err);
        res.status(400).send('Erro na atualização');
    }
});

// DELETE /itens/:id -> Remover
app.delete('/itens/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await client.query('DELETE FROM tarefas WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Item não encontrado');
        }
        res.status(204).send(); // 204 No Content para deleção bem-sucedida
    } catch (err) {
        console.error('Erro ao deletar item:', err);
        res.status(500).send('Erro interno do servidor');
    }
});


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`📡 Servidor Express rodando na porta ${PORT}`);
});