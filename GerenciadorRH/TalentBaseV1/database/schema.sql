-- =====================================================================
-- TalentBase — Script de criação do banco de dados (MySQL 8+)
-- Gerado a partir de docs/DER-TALENTBASE.md
-- =====================================================================

CREATE DATABASE IF NOT EXISTS talentbase
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE talentbase;

-- ---------------------------------------------------------------------
-- usuario — credenciais de acesso (RH ou Candidato)
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario      INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    senha_hash      VARCHAR(255) NOT NULL,
    tipo_usuario    ENUM('RH', 'CANDIDATO') NOT NULL,
    data_cadastro   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuario_email UNIQUE (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- departamento — tabela de apoio (substitui a lista fixa do front-end)
-- ---------------------------------------------------------------------
CREATE TABLE departamento (
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL,
    CONSTRAINT uq_departamento_nome UNIQUE (nome)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- habilidade — tabela de apoio (normaliza os arrays skills[] do front)
-- ---------------------------------------------------------------------
CREATE TABLE habilidade (
    id_habilidade   INT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(100) NOT NULL,
    CONSTRAINT uq_habilidade_nome UNIQUE (nome)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- candidato — pode existir sem usuario (cadastro manual pelo RH)
-- ---------------------------------------------------------------------
CREATE TABLE candidato (
    id_candidato                INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario                  INT NULL,
    nome                        VARCHAR(150) NOT NULL,
    email                       VARCHAR(150) NOT NULL,
    telefone                    VARCHAR(20) NULL,
    cidade                      VARCHAR(100) NULL,
    estado                      CHAR(2) NULL,
    cargo_pretendido            VARCHAR(150) NULL,
    id_departamento_interesse   INT NULL,
    curriculo_url               VARCHAR(255) NULL,
    data_cadastro               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_candidato_email UNIQUE (email),
    CONSTRAINT uq_candidato_usuario UNIQUE (id_usuario),
    CONSTRAINT fk_candidato_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
        ON DELETE SET NULL,
    CONSTRAINT fk_candidato_departamento
        FOREIGN KEY (id_departamento_interesse) REFERENCES departamento (id_departamento)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- vaga
-- ---------------------------------------------------------------------
CREATE TABLE vaga (
    id_vaga                     INT AUTO_INCREMENT PRIMARY KEY,
    titulo                      VARCHAR(150) NOT NULL,
    id_departamento             INT NOT NULL,
    localizacao                 VARCHAR(150) NULL,
    modalidade                  ENUM('Presencial', 'Híbrido', 'Remoto') NOT NULL,
    tipo_contrato               ENUM('CLT', 'PJ', 'Estágio', 'Freelance') NOT NULL,
    numero_vagas                INT NOT NULL DEFAULT 1,
    status                      ENUM('Aberta', 'Em Processo', 'Encerrada') NOT NULL DEFAULT 'Aberta',
    data_publicacao             DATE NOT NULL DEFAULT (CURRENT_DATE),
    experiencia_minima_meses    INT NOT NULL DEFAULT 0,
    descricao                   TEXT NULL,
    CONSTRAINT fk_vaga_departamento
        FOREIGN KEY (id_departamento) REFERENCES departamento (id_departamento)
        ON DELETE RESTRICT,
    CONSTRAINT chk_vaga_numero_vagas CHECK (numero_vagas >= 1),
    CONSTRAINT chk_vaga_exp_minima CHECK (experiencia_minima_meses >= 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- candidatura — entidade associativa (Candidato N:M Vaga) com atributos
-- próprios; resolve o relacionamento e evita candidatura duplicada.
-- ---------------------------------------------------------------------
CREATE TABLE candidatura (
    id_candidatura      INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato        INT NOT NULL,
    id_vaga             INT NOT NULL,
    status              ENUM('Novo', 'Em Análise', 'Entrevista', 'Aprovado', 'Reprovado') NOT NULL DEFAULT 'Novo',
    data_candidatura    DATE NOT NULL DEFAULT (CURRENT_DATE),
    observacoes         TEXT NULL,
    CONSTRAINT uq_candidatura_candidato_vaga UNIQUE (id_candidato, id_vaga),
    CONSTRAINT fk_candidatura_candidato
        FOREIGN KEY (id_candidato) REFERENCES candidato (id_candidato)
        ON DELETE CASCADE,
    CONSTRAINT fk_candidatura_vaga
        FOREIGN KEY (id_vaga) REFERENCES vaga (id_vaga)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- historico_candidatura — timeline de status de uma candidatura
-- ---------------------------------------------------------------------
CREATE TABLE historico_candidatura (
    id_historico        INT AUTO_INCREMENT PRIMARY KEY,
    id_candidatura      INT NOT NULL,
    status              ENUM('Novo', 'Em Análise', 'Entrevista', 'Aprovado', 'Reprovado') NOT NULL,
    data_mudanca        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    alterado_por        VARCHAR(150) NOT NULL,
    CONSTRAINT fk_historico_candidatura
        FOREIGN KEY (id_candidatura) REFERENCES candidatura (id_candidatura)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- experiencia_profissional
-- ---------------------------------------------------------------------
CREATE TABLE experiencia_profissional (
    id_experiencia      INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato        INT NOT NULL,
    empresa             VARCHAR(150) NOT NULL,
    cargo               VARCHAR(150) NOT NULL,
    data_inicio         DATE NOT NULL,
    data_fim            DATE NULL COMMENT 'NULL = emprego atual',
    descricao           TEXT NULL,
    CONSTRAINT fk_experiencia_candidato
        FOREIGN KEY (id_candidato) REFERENCES candidato (id_candidato)
        ON DELETE CASCADE,
    CONSTRAINT chk_experiencia_datas CHECK (data_fim IS NULL OR data_fim >= data_inicio)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- candidato_habilidade — tabela associativa pura (Candidato N:M Habilidade)
-- ---------------------------------------------------------------------
CREATE TABLE candidato_habilidade (
    id_candidato    INT NOT NULL,
    id_habilidade   INT NOT NULL,
    PRIMARY KEY (id_candidato, id_habilidade),
    CONSTRAINT fk_ch_candidato
        FOREIGN KEY (id_candidato) REFERENCES candidato (id_candidato)
        ON DELETE CASCADE,
    CONSTRAINT fk_ch_habilidade
        FOREIGN KEY (id_habilidade) REFERENCES habilidade (id_habilidade)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- vaga_habilidade — tabela associativa pura (Vaga N:M Habilidade)
-- ---------------------------------------------------------------------
CREATE TABLE vaga_habilidade (
    id_vaga         INT NOT NULL,
    id_habilidade   INT NOT NULL,
    PRIMARY KEY (id_vaga, id_habilidade),
    CONSTRAINT fk_vh_vaga
        FOREIGN KEY (id_vaga) REFERENCES vaga (id_vaga)
        ON DELETE CASCADE,
    CONSTRAINT fk_vh_habilidade
        FOREIGN KEY (id_habilidade) REFERENCES habilidade (id_habilidade)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Índices de apoio para as consultas mais comuns da aplicação
-- ---------------------------------------------------------------------
CREATE INDEX idx_candidatura_vaga ON candidatura (id_vaga);
CREATE INDEX idx_candidatura_candidato ON candidatura (id_candidato);
CREATE INDEX idx_vaga_status ON vaga (status);
CREATE INDEX idx_vaga_departamento ON vaga (id_departamento);

-- ---------------------------------------------------------------------
-- Exemplo de consulta que substitui o antigo Job.candidatesCount
-- (ver docs/DER-TALENTBASE.md, seção 5.3)
-- ---------------------------------------------------------------------
-- SELECT v.id_vaga, v.titulo, COUNT(c.id_candidatura) AS total_candidatos
-- FROM vaga v
-- LEFT JOIN candidatura c ON c.id_vaga = v.id_vaga
-- GROUP BY v.id_vaga, v.titulo;

-- ---------------------------------------------------------------------
-- Dados de apoio (seed) — departamentos e habilidades usados pelo front
-- ---------------------------------------------------------------------
INSERT INTO departamento (nome) VALUES
    ('Tecnologia'), ('Marketing'), ('Gestão'), ('Produto'),
    ('Recursos Humanos'), ('Financeiro'), ('Comercial');

INSERT INTO habilidade (nome) VALUES
    ('React'), ('TypeScript'), ('CSS'), ('Node.js'), ('Python'), ('AWS'),
    ('Figma'), ('SQL'), ('Power BI'), ('Scrum'), ('SEO'), ('Google Ads');
