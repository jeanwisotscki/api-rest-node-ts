import { Router } from "express";

import {
  CidadesController,
  PessoasController,
  UsuariosController,
} from "../controllers";
import { ensureAuth } from "../shared/middleware";

const router = Router();

router.get("/", (_, res) => {
  return res.send("Fala, get!");
});

/***** routes Cidades *****/
router.get(
  "/cidades",
  ensureAuth,
  CidadesController.getAllValidation,
  CidadesController.getAll
);

router.post(
  "/cidades",
  ensureAuth,
  CidadesController.createValidation,
  CidadesController.create
);

router.get(
  "/cidades/:id",
  ensureAuth,
  CidadesController.getByIdValidation,
  CidadesController.getById
);

router.put(
  "/cidades/:id",
  ensureAuth,
  CidadesController.updateByIdValidation,
  CidadesController.updateById
);

router.delete(
  "/cidades/:id",
  ensureAuth,
  CidadesController.deleteByIdValidation,
  CidadesController.deleteById
);

/***** routes Pessoas *****/
router.get(
  "/pessoas",
  ensureAuth,
  PessoasController.getAllValidation,
  PessoasController.getAll
);

router.post(
  "/pessoas",
  ensureAuth,
  PessoasController.createValidation,
  PessoasController.create
);

router.get(
  "/pessoas/:id",
  ensureAuth,
  PessoasController.getByIdValidation,
  PessoasController.getById
);

router.put(
  "/pessoas/:id",
  ensureAuth,
  PessoasController.updateByIdValidation,
  PessoasController.updateById
);

router.delete(
  "/pessoas/:id",
  ensureAuth,
  PessoasController.deleteByIdValidation,
  PessoasController.deleteById
);

/***** routes Usuários *****/
router.post(
  "/entrar",
  UsuariosController.signInValidation,
  UsuariosController.signIn
);

router.post(
  "/cadastrar",
  UsuariosController.signUpValidation,
  UsuariosController.signUp
);

export { router };
