import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";

import { validation } from "../../shared/middleware";

interface IParamsProps {
  id: number;
}

export const deleteByIdValidation = validation((getSchema) => ({
  params: getSchema<IParamsProps>(
    yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
    })
  ),
}));

export const deleteById = async (
  req: Request<{}, {}, IParamsProps>,
  res: Response
) => {
  console.log(req.params);

  return res
    .status(StatusCodes.OK)
    .send("Método: deleteById - Não implementado");
};
