BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Demandantes] (
    [id] NVARCHAR(1000) NOT NULL,
    [sigla] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Demandantes_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Demandantes_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Demandantes_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Demandantes_nome_key] UNIQUE NONCLUSTERED ([nome])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
