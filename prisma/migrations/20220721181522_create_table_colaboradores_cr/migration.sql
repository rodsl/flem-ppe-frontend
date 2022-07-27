BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Colaboradores_Cr] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [cpf] NVARCHAR(1000) NOT NULL,
    [matriculaFlem] INT NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Colaboradores_Cr_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Colaboradores_Cr_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Colaboradores_Cr_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Colaboradores_Cr_matriculaFlem_key] UNIQUE NONCLUSTERED ([matriculaFlem])
);

-- CreateTable
CREATE TABLE [dbo].[_Ba_Acoes_CrToBa_Colaboradores_Cr] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_Ba_Acoes_CrToBa_Colaboradores_Cr_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Ba_Acoes_CrToBa_Colaboradores_Cr_B_index] ON [dbo].[_Ba_Acoes_CrToBa_Colaboradores_Cr]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_Acoes_CrToBa_Colaboradores_Cr] ADD CONSTRAINT [_Ba_Acoes_CrToBa_Colaboradores_Cr_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Ba_Acoes_Cr]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_Acoes_CrToBa_Colaboradores_Cr] ADD CONSTRAINT [_Ba_Acoes_CrToBa_Colaboradores_Cr_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ba_Colaboradores_Cr]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
