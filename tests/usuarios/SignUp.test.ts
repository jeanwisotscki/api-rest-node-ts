import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("usuarios - SignUp", () => {
  //
  it("Cria um registro", async () => {
    const res1 = await testServer.post("/cadastrar").send({
      senha: "12341234",
      email: "testeSignUp@gmail.com",
      nome: "Teste SignUp",
    });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual("number");
  });

  //
  it("Cria um registro 2", async () => {
    const res1 = await testServer.post("/cadastrar").send({
      senha: "12341234",
      email: "testeSignUp2@gmail.com",
      nome: "Teste SignUp 2",
    });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual("number");
  });

  //
  it("Tenta criar um registro com email já existente", async () => {
    const res1 = await testServer.post("/cadastrar").send({
      senha: "1234567",
      email: "testeSignUpDuplicado@gmail.com",
      nome: "SignUp duplicado",
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual("number");

    const res2 = await testServer.post("/cadastrar").send({
      senha: "1234567",
      email: "testeSignUpDuplicado@gmail.com",
      nome: "duplicado",
    });
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toHaveProperty("errors.default");
  });

  //
  it("Tenta criar um registro com nome muito curto", async () => {
    const res1 = await testServer.post("/cadastrar").send({
      senha: "1234567",
      email: "testeSignUp@gmail.com",
      nome: "ab",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nome");
  });

  //
  it("Tenta criar um registro sem nome", async () => {
    const res1 = await testServer.post("/cadastrar").send({
      senha: "1234567",
      email: "testeSignUp@gmail.com",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nome");
  });

  //
  it("Tenta criar um registro sem email", async () => {
    const res1 = await testServer.post("/cadastrar").send({
      senha: "1234567",
      nome: "Teste SignUp",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.email");
  });

  //
  it("Tenta criar um registro com email inválido", async () => {
    const res1 = await testServer.post("/cadastrar").send({
      email: "testeSignUp gmail.com",
      nome: "Teste SignUp",
      senha: "1234567",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.email");
  });

  //
  it("Tenta criar um registro sem senha", async () => {
    const res1 = await testServer.post("/cadastrar").send({
      email: "testeSignUp@gmail.com",
      nome: "Teste SignUp",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.senha");
  });

  //
  it("Tenta criar um registro com a senha menor que 6", async () => {
    const res1 = await testServer.post("/cadastrar").send({
      senha: "abc",
      email: "testeSignUp@gmail.com",
      nome: "Teste SignUp",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.senha");
  });

  //
  it("Tenta criar um registro sem enviar nenhuma propriedade", async () => {
    const res1 = await testServer.post("/cadastrar").send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.senha");
    expect(res1.body).toHaveProperty("errorsResult.body.email");
    expect(res1.body).toHaveProperty("errorsResult.body.nome");
  });
});
