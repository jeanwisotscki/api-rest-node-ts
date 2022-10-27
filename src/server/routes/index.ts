import { Router } from "express";

import { CidadesController } from "../controllers";

const router = Router();

router.get("/", (_, res) => {
  return res.send("Fala, get!");
});

router.post(
  "/cidades",
  CidadesController.createValidation,
  CidadesController.create
);

router.get(
  "/cidades",
  CidadesController.getAllValidation,
  CidadesController.getAll
);

router.get(
  "/cidades/:id",
  CidadesController.getByIdValidation,
  CidadesController.getById
);

export { router };
