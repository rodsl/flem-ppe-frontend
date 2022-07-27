BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD [tipoAcaoCr_Id] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[Ba_Tipos_Acoes_Cr] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Tipos_Acoes_Cr_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Tipos_Acoes_Cr_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Tipos_Acoes_Cr_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD CONSTRAINT [Ba_Acoes_Cr_tipoAcaoCr_Id_fkey] FOREIGN KEY ([tipoAcaoCr_Id]) REFERENCES [dbo].[Ba_Tipos_Acoes_Cr]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
