import { DateTime } from "luxon";
import { prisma } from "services/prisma/prismaClient";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getEvento(req, res);
      break;
    case "POST":
      await addEvento(req, res);
      break;
    case "PUT":
      await modifyEvento(req, res);
      break;
    case "DELETE":
      await deleteEvento(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getEvento = async (req, res) => {
  const { entity, idEvento } = req.query;
  try {
    const table = `${entity}_Eventos`;

    if (idEvento) {
      const query = await prisma[table].findFirst({
        orderBy: [
          {
            nome: "asc",
          },
        ],
        where: {
          excluido: {
            equals: false,
          },
          id: idEvento,
        },
        include: {
          localEvento: true,
          tipoEvento: true,
          benefAssoc: true,
          acao_Cr: {
            include: {
              colabCr: true,
            },
          },
        },
      });
      return res.status(200).json(query);
    }
    const query = await prisma[table].findMany({
      orderBy: [
        {
          nome: "asc",
        },
      ],
      where: {
        excluido: {
          equals: false,
        },
      },
      include: {
        localEvento: true,
        tipoEvento: true,
        benefAssoc: true,
        acao_Cr: {
          include: {
            colabCr: true,
          },
        },
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const addEvento = async (req, res) => {
  const { entity } = req.query;
  const {
    nome,
    modalidade,
    data,
    local,
    tipo,
    benefAssoc,
    criarAcaoCR,
    colabAcaoCR = [],
    conteudoEmail = null,
  } = req.body;
  const benefMatriculas = benefAssoc.map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc.map((benef) => benef.value.toString());
  const colabMatriculas = colabAcaoCR.map((colab) => parseInt(colab.value));

  try {
    const table = `${entity}_Eventos`;
    const tableBeneficiarios = `${entity}_Beneficiarios`;

    const benefToConnectAcao = await prisma[tableBeneficiarios].findMany({
      where: {
        OR: [
          {
            cpf: {
              in: benefCPFs,
            },
          },
          {
            matriculaFlem: {
              in: benefMatriculas,
            },
          },
        ],
      },
    });

    const query = await prisma[table].create({
      data: {
        nome,
        modalidade,
        data: DateTime.fromISO(data).toISO(),
        local_EventoId: local,
        tipo_eventoId: tipo,
        benefAssoc: {
          connect: benefToConnectAcao.map(({ id }) => ({ id })),
        },
        acao_Cr: criarAcaoCR
          ? {
              create: {
                nome,
                descricao:
                  "Ação gerada automaticamente na criação do evento " + nome,
                benefAssoc: {
                  connect: benefToConnectAcao.map(({ id }) => ({ id })),
                },
                colabCr: {
                  connect: colabMatriculas.map((value) => ({
                    matriculaFlem: value,
                  })),
                },
              },
            }
          : {},
      },
      include: {
        acao_Cr: true,
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    switch (error.code) {
      case "P2002":
        res.status(409).json({ error: "Unique constraint failed" });
        break;

      default:
        res.status(500).json({ error: error });
        break;
    }
  }
};

const modifyEvento = async (req, res) => {
  const { entity } = req.query;
  const {
    id,
    nome,
    modalidade,
    data,
    local,
    tipo,
    benefAssoc,
    acao_CrId,
    criarAcaoCR,
    colabAcaoCR = [],
    conteudoEmail = null,
  } = req.body;
  const benefMatriculas = benefAssoc.map((benef) => parseInt(benef.value));
  const benefCPFs = benefAssoc.map((benef) => benef.value.toString());
  const colabMatriculas = colabAcaoCR.map((colab) => parseInt(colab.value));

  try {
    const table = `${entity}_Eventos`;
    const tableAcoesCr = `${entity}_Acoes_Cr`;
    const tableBeneficiarios = `${entity}_Beneficiarios`;

    const benefToConnectAcao = await prisma[tableBeneficiarios].findMany({
      where: {
        OR: [
          {
            cpf: {
              in: benefCPFs,
            },
          },
          {
            matriculaFlem: {
              in: benefMatriculas,
            },
          },
        ],
      },
    });

    const acaoCr = async () => {
      if (criarAcaoCR) {
        return await prisma[tableAcoesCr].upsert({
          where: {
            id: acao_CrId === null ? "" : acao_CrId,
          },
          update: {
            nome,
            descricao:
              "Ação gerada automaticamente na criação do evento " + nome,
            benefAssoc: {
              set: benefToConnectAcao.map(({ id }) => ({ id })),
            },
            colabCr: {
              set: colabMatriculas.map((value) => ({ matriculaFlem: value })),
            },
            excluido: false,
          },
          create: {
            nome,
            descricao:
              "Ação gerada automaticamente na criação do evento " + nome,
            benefAssoc: {
              connect: benefToConnectAcao.map(({ id }) => ({ id })),
            },
            colabCr: {
              connect: colabMatriculas.map((value) => ({
                matriculaFlem: value,
              })),
            },
          },
        });
      } else if (acao_CrId !== null) {
        return await prisma[tableAcoesCr].update({
          data: {
            excluido: true,
          },
          where: {
            id: acao_CrId,
          },
        });
      } else {
        return null;
      }
    };

    const query = await prisma[table].update({
      data: {
        nome,
        modalidade,
        data: DateTime.fromISO(data).toISO(),
        tipo_eventoId: tipo,
        local_EventoId: local || null,
        benefAssoc: {
          set: benefToConnectAcao.map(({ id }) => ({ id })),
        },
        acao_CrId: acaoCr().id,
      },
      where: {
        id,
      },
    });

    return res.status(200).json(query);
  } catch (error) {
    switch (error.code) {
      case "P2002":
        res.status(409).json({ error: "Unique constraint failed" });
        break;

      default:
        res.status(500).json({ error: error });
        break;
    }
  }
};

const deleteEvento = async (req, res) => {
  const { entity, id } = req.query;
  try {
    const table = `${entity}_Eventos`;
    const query = await prisma[table].update({
      data: {
        excluido: true,
      },
      where: {
        id,
      },
    });
    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};
