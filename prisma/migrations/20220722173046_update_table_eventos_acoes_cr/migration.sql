/*
  Warnings:

  - You are about to drop the column `ba_Acoes_CrId` on the `Ba_Eventos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[acao_CrId]` on the table `Ba_Eventos` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Eventos] DROP CONSTRAINT [Ba_Eventos_ba_Acoes_CrId_fkey];

-- DropIndex
ALTER TABLE [dbo].[Ba_Eventos] DROP CONSTRAINT [Ba_Eventos_ba_Acoes_CrId_key];

-- AlterTable
ALTER TABLE [dbo].[Ba_Eventos] DROP COLUMN [ba_Acoes_CrId];
ALTER TABLE [dbo].[Ba_Eventos] ADD [acao_CrId] NVARCHAR(1000);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Eventos] ADD CONSTRAINT [Ba_Eventos_acao_CrId_key] UNIQUE NONCLUSTERED ([acao_CrId]);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Eventos] ADD CONSTRAINT [Ba_Eventos_acao_CrId_fkey] FOREIGN KEY ([acao_CrId]) REFERENCES [dbo].[Ba_Acoes_Cr]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
