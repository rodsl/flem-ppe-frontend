import nc from "next-connect";
import { readFile, writeFileXLSX, utils } from "xlsx";
import { phoneNumberFixer } from "utils/phoneNumberFixer";
/* load the codepage support library for extended support with older formats  */

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

function camelCase(str) {
  return str
    .replace(/\s(.)/g, function (a) {
      return a.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function (b) {
      return b.toLowerCase();
    });
}

const replaceKeys = (object) => {
  Object.keys(object).forEach(function (key) {
    const newKey = camelCase(
      key
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/\//g, "_")
        .replace(/º/g, "_")
    );
    if (object[key] && typeof object[key] === "object") {
      replaceKeys(object[key]);
    }
    if (key !== newKey) {
      object[newKey] = object[key];
      delete object[key];
    }
  });
  return object;
};

const SHEETS_COLUMNS = [
  "ano",
  "territorio",
  "demandante",
  "modalidade",
  "tipoDeVinculo",
  "municipioDaVaga",
  "municipioDoAluno",
  "nomeDoColegio",
  "eixoDeFormacao",
  "cursoDeFormacao",
  "dataDeNascimento",
  "raca_cor",
  "deficiencia",
  "cpfAluno",
  "sexo",
  "matricula",
  "nome",
  "telefone01",
  "telefone02",
  "dataDaConvocacao",
];

try {
  handler.get((req, res) => {
    console.log(req.query);
    const { filename } = req.query;
    const workbook = readFile(`./public/uploads/${filename}`, {
      type: "array",
      cellDates: true,
    });
    const sheet = {};
    workbook.SheetNames.forEach((sheetName) => {
      const rawRows = utils.sheet_to_json(workbook.Sheets[sheetName], {
        raw: true,
        defval: null,
      });
      rawRows.map((row) => replaceKeys(row));
      const filterColumns = rawRows.map((row) =>
        Object.fromEntries(
          Object.entries(row).filter(([key]) => SHEETS_COLUMNS.includes(key))
        )
      );
      const rows = filterColumns
        .filter((row) => Object.keys(row).length === SHEETS_COLUMNS.length)
        .map((row) => ({
          ...row,
          telefone01: phoneNumberFixer(row.telefone01, "BR"),
          telefone02: phoneNumberFixer(row.telefone02, "BR"),
        }));
      if (rows.length > 0) {
        sheet[sheetName] = rows;
      }
    });
    if (Object.keys(sheet).length === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "invalid file columns" });
    }
    return res.status(200).json({ ok: true, sheet });
  });

  handler.patch(async (req, res) => {
    throw new Error("Throws me around! Error can be caught and handled.");
  });
} catch (error) {
  console.log(error);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
