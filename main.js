const pg = require('pg');

// Configurações da conexão
const config = {
    user: 'seu_usuario', // Ex: postgres
    host: 'localhost',
    database: 'web2_db', // O nome que você criou
    password: 'sua_senha',
    port: 5432,
};

const client = new pg.Client(config);

client.connect()
    .then(() => console.log('✅ Conexão com PostgreSQL bem-sucedida!'))
    .catch(err => console.error('❌ Erro na conexão com PostgreSQL:', err.stack));

// Exporta o cliente para ser usado nas rotas
module.exports = client;

const API_URL = 'http://localhost:3000/itens';
const formTarefa = document.getElementById('form-tarefa');
const tarefasContainer = document.getElementById('tarefas-container');

// 1. Função para carregar e exibir as tarefas (GET /itens)
async function carregarTarefas() {
    try {
        const response = await fetch(API_URL);
        const tarefas = await response.json();
        
        tarefasContainer.innerHTML = ''; // Limpa a lista antes de recarregar
        
        // Exibição dinâmica de dados no DOM
        tarefas.forEach(tarefa => {
            const div = document.createElement('div');
            div.className = `tarefa-item ${tarefa.status}`;
            div.innerHTML = `
                <h3>${tarefa.titulo}</h3>
                <p>${tarefa.descricao || 'Sem descrição.'}</p>
                <small>Status: ${tarefa.status} | Criado em: ${new Date(tarefa.criado_em).toLocaleDateString()}</small>
                <button onclick="deletarTarefa(${tarefa.id})">Remover</button>
                <button onclick="atualizarStatus(${tarefa.id}, '${tarefa.status === 'pendente' ? 'concluida' : 'pendente'}')">
                    ${tarefa.status === 'pendente' ? 'Concluir' : 'Reverter'}
                </button>
            `;
            tarefasContainer.appendChild(div);
        });

    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        tarefasContainer.innerHTML = '<p>Erro ao carregar dados.</p>';
    }
}

// 2. Evento de submissão do formulário (POST /itens)
formTarefa.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    const novaTarefa = { titulo, descricao, status: 'pendente' };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaTarefa)
        });

        formTarefa.reset(); // Limpa o formulário
        carregarTarefas(); // Recarrega a lista
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
        alert('Erro ao salvar tarefa.');
    }
});

// 3. Função para deletar (DELETE /itens/:id)
async function deletarTarefa(id) {
    if (!confirm('Tem certeza que deseja remover esta tarefa?')) return;
    
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        carregarTarefas();
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        alert('Erro ao deletar tarefa.');
    }
}

// 4. Função para atualizar status (PUT /itens/:id)
async function atualizarStatus(id, novoStatus) {
    const dadosAtualizados = { status: novoStatus };
    
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        });
        carregarTarefas();
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status.');
    }
}

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', carregarTarefas);