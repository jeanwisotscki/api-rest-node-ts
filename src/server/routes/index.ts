import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/", (_, res) => {
  return res.send("Fala, get!");
});

router.post("/post", (req, res) => {
  console.log(req.body);

  return res.status(StatusCodes.OK).json(req.body);
});

export { router };
