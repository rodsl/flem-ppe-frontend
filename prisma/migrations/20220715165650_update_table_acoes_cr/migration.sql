BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[Ba_Acoes_Cr] DROP CONSTRAINT [Ba_Acoes_Cr_codAcao_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'Ba_Acoes_Cr'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_Ba_Acoes_Cr] (
    [id] NVARCHAR(1000) NOT NULL,
    [codAcao] INT NOT NULL IDENTITY(1,1),
    [nome] NVARCHAR(1000) NOT NULL,
    [descricao] TEXT NOT NULL,
    [excluido] BIT NOT NULL CONSTRAINT [Ba_Acoes_Cr_excluido_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Ba_Acoes_Cr_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [eventoId] NVARCHAR(1000),
    CONSTRAINT [Ba_Acoes_Cr_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_Ba_Acoes_Cr] ON;
IF EXISTS(SELECT * FROM [dbo].[Ba_Acoes_Cr])
    EXEC('INSERT INTO [dbo].[_prisma_new_Ba_Acoes_Cr] ([codAcao],[createdAt],[descricao],[eventoId],[excluido],[id],[nome],[updatedAt]) SELECT [codAcao],[createdAt],[descricao],[eventoId],[excluido],[id],[nome],[updatedAt] FROM [dbo].[Ba_Acoes_Cr] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_Ba_Acoes_Cr] OFF;
DROP TABLE [dbo].[Ba_Acoes_Cr];
EXEC SP_RENAME N'dbo._prisma_new_Ba_Acoes_Cr', N'Ba_Acoes_Cr';
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
