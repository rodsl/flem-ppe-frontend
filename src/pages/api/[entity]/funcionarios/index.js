import axios from "axios";
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
      await getFuncionariosRh(req, res);
      break;
    case "POST":
      await addSituacaoVaga(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET or POST requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getFuncionariosRh = async (req, res) => {
  const { entity, ...params } = req.query;
  try {
    const query = await prisma.ba_Colaboradores_Cr.findMany({
      where: {
        excluido: false,
      },
      orderBy:{
        nome: "asc"
      }
    });
    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

const addFuncionarios = async (req, res) => {
  const { entity, nome, cpf, matriculaFlem, matriculaSaeb } = req.query;
  const { data: benef } = await axios.get(
    "http://localhost:3001/api/funcionarios",
    {
      params: {
        id_situacao: 1,
        id_departamento: 125,
        condition: "AND",
      },
    }
  );
  try {
    const query = await prisma.ba_Colaboradores_Cr.createMany({
      data: benef.map((ben) => ({
        nome: ben.func_nome,
        cpf: ben.func_cpf,
        matriculaFlem: ben.func_matricula,
      })),
    });
    return res.status(200).json(query);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
