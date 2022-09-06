const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  etniaSeed,
  tamanhoUniformeSeed,
  formacoesSeed,
  pendenciasTiposSeed,
  tipoHistoricoSeed,
  demandantesSeed,
  municSeed,
  situacoesVagaSeed
} = require("./seeds");

const main = async () => {
  const etnia = await etniaSeed(prisma);
  const tamanhoUniforme = await tamanhoUniformeSeed(prisma);
  const formacoes = await formacoesSeed(prisma);
  const pendenciasTipos = await pendenciasTiposSeed(prisma);
  const tiposHistorico = await tipoHistoricoSeed(prisma);
  const demandantes = await demandantesSeed(prisma);
  const municipios = await municSeed(prisma);
  const situacoesVaga = await situacoesVagaSeed(prisma);

  console.log({
    etnia,
    tamanhoUniforme,
    formacoes,
    pendenciasTipos,
    tiposHistorico,
    demandantes,
    municipios,
    situacoesVaga
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
