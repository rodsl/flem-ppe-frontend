BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Ba_Beneficiarios] (
    [id] NVARCHAR(1000) NOT NULL,
    [nome] NVARCHAR(1000) NOT NULL,
    [cpf] NVARCHAR(1000) NOT NULL,
    [matriculaFlem] INT NOT NULL,
    [matriculaSaeb] INT NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Beneficiarios_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Beneficiarios_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Ba_Beneficiarios_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ba_Beneficiarios_nome_key] UNIQUE NONCLUSTERED ([nome]),
    CONSTRAINT [Ba_Beneficiarios_matriculaFlem_key] UNIQUE NONCLUSTERED ([matriculaFlem]),
    CONSTRAINT [Ba_Beneficiarios_matriculaSaeb_key] UNIQUE NONCLUSTERED ([matriculaSaeb])
);

-- CreateTable
CREATE TABLE [dbo].[_Ba_Acoes_CrToBa_Beneficiarios] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_Ba_Acoes_CrToBa_Beneficiarios_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_Ba_Acoes_CrToBa_Beneficiarios_B_index] ON [dbo].[_Ba_Acoes_CrToBa_Beneficiarios]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Ba_Acoes_Cr] ADD CONSTRAINT [Ba_Acoes_Cr_eventoId_fkey] FOREIGN KEY ([eventoId]) REFERENCES [dbo].[Ba_Eventos]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_Acoes_CrToBa_Beneficiarios] ADD CONSTRAINT [_Ba_Acoes_CrToBa_Beneficiarios_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Ba_Acoes_Cr]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_Ba_Acoes_CrToBa_Beneficiarios] ADD CONSTRAINT [_Ba_Acoes_CrToBa_Beneficiarios_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Ba_Beneficiarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
