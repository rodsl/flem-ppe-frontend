BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Ba_Materiais_Entregues] ADD [observacao] TEXT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
