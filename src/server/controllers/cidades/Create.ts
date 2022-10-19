import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";

interface ICidade {
  nome: string;
}

const bodyValidation: yup.SchemaOf<ICidade> = yup.object().shape({
  nome: yup.string().required().min(3),
});

export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
  let validatedData: ICidade | undefined = undefined;

  try {
    validatedData = await bodyValidation.validate(req.body);
  } catch (err) {
    const yupError = err as yup.ValidationError;
    console.log(yupError.message);

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: { default: yupError.message } });
  }

  return res.send(validatedData);
};
