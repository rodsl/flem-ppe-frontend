BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Locais_Eventos] (
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
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Locais_Eventos_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Locais_Eventos_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Locais_Eventos_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Locais_Eventos_nome_key] UNIQUE NONCLUSTERED ([nome])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Tipos_Eventos] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Tipos_Eventos_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Tipos_Eventos_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Tipos_Eventos_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Tipos_Eventos_nome_key] UNIQUE NONCLUSTERED ([nome])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Eventos] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [data] DATETIME2 NOT NULL,
    [modalidade] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Eventos_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Eventos_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [local_EventoId] NVARCHAR(1000),
    [tipo_eventoId] NVARCHAR(1000),
    CONSTRAINT [Ba_Eventos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Ba_Acoes_Cr] (
    [id] NVARCHAR(1000) NOT NULL,
    [codAcao] INT NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Acoes_Cr_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Acoes_Cr_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [eventoId] NVARCHAR(1000),
    CONSTRAINT [Ba_Acoes_Cr_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Acoes_Cr_codAcao_key] UNIQUE NONCLUSTERED ([codAcao])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Eventos] ADD CONSTRAINT [Ba_Eventos_local_EventoId_fkey] FOREIGN KEY ([local_EventoId]) REFERENCES [dbo].[Ba_Locais_Eventos]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Eventos] ADD CONSTRAINT [Ba_Eventos_tipo_eventoId_fkey] FOREIGN KEY ([tipo_eventoId]) REFERENCES [dbo].[Ba_Tipos_Eventos]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD CONSTRAINT [Ba_Acoes_Cr_eventoId_fkey] FOREIGN KEY ([eventoId]) REFERENCES [dbo].[Ba_Eventos]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
