DROP TABLE IF EXISTS tarefas;

CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tarefas (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  -- ALTERAÇÃO AQUI: Usando VARCHAR com um limite de tamanho
  status VARCHAR(50) DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT NOW()
);