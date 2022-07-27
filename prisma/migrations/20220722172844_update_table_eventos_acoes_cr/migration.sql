/*
  Warnings:

  - You are about to drop the column `eventoId` on the `Ba_Acoes_Cr` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ba_Acoes_CrId]` on the table `Ba_Eventos` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Ba_Acoes_Cr] DROP CONSTRAINT [Ba_Acoes_Cr_eventoId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Ba_Acoes_Cr] DROP COLUMN [eventoId];

-- AlterTable
ALTER TABLE [dbo].[Ba_Eventos] ADD [ba_Acoes_CrId] NVARCHAR(1000);

-- CreateIndex
ALTER TABLE [dbo].[Ba_Eventos] ADD CONSTRAINT [Ba_Eventos_ba_Acoes_CrId_key] UNIQUE NONCLUSTERED ([ba_Acoes_CrId]);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Eventos] ADD CONSTRAINT [Ba_Eventos_ba_Acoes_CrId_fkey] FOREIGN KEY ([ba_Acoes_CrId]) REFERENCES [dbo].[Ba_Acoes_Cr]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
