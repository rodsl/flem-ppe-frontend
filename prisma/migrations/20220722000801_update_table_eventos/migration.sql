BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[_Ba_BeneficiariosToBa_Eventos] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_Ba_BeneficiariosToBa_Eventos_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Ba_BeneficiariosToBa_Eventos_B_index] ON [dbo].[_Ba_BeneficiariosToBa_Eventos]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Eventos] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Eventos_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_BeneficiariosToBa_Eventos] ADD CONSTRAINT [_Ba_BeneficiariosToBa_Eventos_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ba_Eventos]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
