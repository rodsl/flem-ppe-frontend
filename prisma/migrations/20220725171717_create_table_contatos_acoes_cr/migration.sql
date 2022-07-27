BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Contatos_Acoes_Cr] (
    [id] NVARCHAR(1000) NOT NULL,
    [descricao] TEXT NOT NULL,
    [concluido] BIT NOT NULL CONSTRAINT [Ba_Contatos_Acoes_Cr_concluido_df] DEFAULT 0,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Contatos_Acoes_Cr_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Contatos_Acoes_Cr_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [acaoCr_id] NVARCHAR(1000),
    [beneficiario_id] NVARCHAR(1000),
    [colabCr_id] NVARCHAR(1000),
    CONSTRAINT [Ba_Contatos_Acoes_Cr_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Acoes_Cr] ADD CONSTRAINT [Ba_Contatos_Acoes_Cr_acaoCr_id_fkey] FOREIGN KEY ([acaoCr_id]) REFERENCES [dbo].[Ba_Acoes_Cr]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Acoes_Cr] ADD CONSTRAINT [Ba_Contatos_Acoes_Cr_beneficiario_id_fkey] FOREIGN KEY ([beneficiario_id]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Contatos_Acoes_Cr] ADD CONSTRAINT [Ba_Contatos_Acoes_Cr_colabCr_id_fkey] FOREIGN KEY ([colabCr_id]) REFERENCES [dbo].[Ba_Colaboradores_Cr]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
