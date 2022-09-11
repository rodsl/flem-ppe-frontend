BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Ba_Comunicados] DROP CONSTRAINT [Ba_Comunicados_historico_Id_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
