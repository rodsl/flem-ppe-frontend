/*
  Warnings:

  - You are about to drop the column `acao_CrId` on the `Ba_Eventos` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Eventos] DROP CONSTRAINT [Ba_Eventos_acao_CrId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD [evento_id] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[Ba_Eventos] DROP COLUMN [acao_CrId];

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD CONSTRAINT [Ba_Acoes_Cr_evento_id_fkey] FOREIGN KEY ([evento_id]) REFERENCES [dbo].[Ba_Eventos]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
