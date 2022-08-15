import multer from "multer";
import nc from "next-connect";
import fs from "fs";
import { prisma } from "services/prisma/prismaClient";
import { DateTime } from "luxon";
import { axios } from "services/apiService";

const fileCatalogList = [];

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const { referencesTo } = req.query;
      const dest = `./public/uploads/Portal_PPE/${DateTime.now()
        .setLocale("pt-BR")
        .toFormat("yyyy/MM/dd")}/${referencesTo}`;
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      req.dest = dest;
      req.referencesTo = referencesTo;
      return cb(null, dest);
    },
    filename: async (req, file, cb) => {
      const id = DateTime.now().toFormat("HHmmss");
      const { referencesTo } = req.query;
      const catalogFileOnBd = await prisma.ba_Uploads.create({
        data: {
          name: `${id}_${file.originalname}`,
          originalName: file.originalname,
          path: req.dest,
          referencesTo,
        },
      });
      fileCatalogList.push(catalogFileOnBd);
      return cb(null, `${id}_${file.originalname}`);
    },
  }),
  fileFilter: async (req, file, cb) => {
    const checkFileExists = await prisma.ba_Uploads.findFirst({
      where: {
        name: file.originalname,
      },
    });

    if (checkFileExists !== null) {
      return cb(null, false);
    }
    return cb(null, true);
  },
});

const handler = nc({
  onError: (err, req, res, next) => {
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

try {
  handler.use(upload.array("files"));

  handler.post((req, res) => {
    const { referencesTo } = req.query;

    if (fileCatalogList.length === 0) {
      return res.status(200).json({
        ok: true,
        referencesTo: referencesTo,
        files: [],
      });
    }

    return res.status(200).json({
      ok: true,
      referencesTo: referencesTo,
      files: fileCatalogList,
    });
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
