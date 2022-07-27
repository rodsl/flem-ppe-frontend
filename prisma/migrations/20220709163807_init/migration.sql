BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Oficio_Template] (
    [id] NVARCHAR(1000) NOT NULL,
    [titulo] NVARCHAR(1000) NOT NULL,
    [descricao] NVARCHAR(1000),
    [conteudo] TEXT NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Oficio_Template_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Oficio_Template_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [oficio_TipoId] NVARCHAR(1000),
    CONSTRAINT [Ba_Oficio_Template_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Oficio_Template_titulo_key] UNIQUE NONCLUSTERED ([titulo])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Oficio_Tipo] (
    [id] NVARCHAR(1000) NOT NULL,
    [sigla] NVARCHAR(1000) NOT NULL,
    [descricao] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Oficio_Tipo_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Oficio_Tipo_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Oficio_Tipo_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Oficio_Tipo_sigla_key] UNIQUE NONCLUSTERED ([sigla]),
    CONSTRAINT [Ba_Oficio_Tipo_descricao_key] UNIQUE NONCLUSTERED ([descricao])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Formacao] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Formacao_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Formacao_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [eixo_FormacaoId] NVARCHAR(1000),
    CONSTRAINT [Ba_Formacao_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Formacao_nome_key] UNIQUE NONCLUSTERED ([nome])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Eixo_Formacao] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Eixo_Formacao_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Eixo_Formacao_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Eixo_Formacao_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Eixo_Formacao_nome_key] UNIQUE NONCLUSTERED ([nome])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Escritorio_Regional] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [cep] NVARCHAR(1000) NOT NULL,
    [logradouro] NVARCHAR(1000) NOT NULL,
    [complemento] NVARCHAR(1000),
    [bairro] NVARCHAR(1000) NOT NULL,
    [cidade] NVARCHAR(1000) NOT NULL,
    [uf] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [num_contato] NVARCHAR(1000),
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Escritorio_Regional_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Escritorio_Regional_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Escritorio_Regional_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Escritorio_Regional_nome_key] UNIQUE NONCLUSTERED ([nome])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Monitores] (
    [id] NVARCHAR(1000) NOT NULL,
    [matricula] INT NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Monitores_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Monitores_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [escritorio_RegionalId] NVARCHAR(1000),
    CONSTRAINT [Ba_Monitores_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Monitores_matricula_key] UNIQUE NONCLUSTERED ([matricula])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Municipios] (
    [id] NVARCHAR(1000) NOT NULL,
    [idIBGE] INT NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Municipios_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Municipios_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [escritorio_RegionalId] NVARCHAR(1000),
    CONSTRAINT [Ba_Municipios_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Municipios_idIBGE_key] UNIQUE NONCLUSTERED ([idIBGE])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Situacoes_Vaga] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Situacoes_Vaga_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Situacoes_Vaga_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [situacao_Vaga_Id] NVARCHAR(1000),
    CONSTRAINT [Ba_Situacoes_Vaga_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Situacoes_Vaga_nome_key] UNIQUE NONCLUSTERED ([nome])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Tipos_Situacoes_Vaga] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Tipos_Situacoes_Vaga_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Tipos_Situacoes_Vaga_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Tipos_Situacoes_Vaga_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Tipos_Situacoes_Vaga_nome_key] UNIQUE NONCLUSTERED ([nome])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Oficio_Template] ADD CONSTRAINT [Ba_Oficio_Template_oficio_TipoId_fkey] FOREIGN KEY ([oficio_TipoId]) REFERENCES [dbo].[Ba_Oficio_Tipo]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Formacao] ADD CONSTRAINT [Ba_Formacao_eixo_FormacaoId_fkey] FOREIGN KEY ([eixo_FormacaoId]) REFERENCES [dbo].[Ba_Eixo_Formacao]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Monitores] ADD CONSTRAINT [Ba_Monitores_escritorio_RegionalId_fkey] FOREIGN KEY ([escritorio_RegionalId]) REFERENCES [dbo].[Ba_Escritorio_Regional]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Municipios] ADD CONSTRAINT [Ba_Municipios_escritorio_RegionalId_fkey] FOREIGN KEY ([escritorio_RegionalId]) REFERENCES [dbo].[Ba_Escritorio_Regional]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Situacoes_Vaga] ADD CONSTRAINT [Ba_Situacoes_Vaga_situacao_Vaga_Id_fkey] FOREIGN KEY ([situacao_Vaga_Id]) REFERENCES [dbo].[Ba_Tipos_Situacoes_Vaga]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
