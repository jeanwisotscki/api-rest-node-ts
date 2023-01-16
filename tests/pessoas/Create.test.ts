import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("pessoas - Create", () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post("/cidades")
      .send({ nome: "teste Create" });

    cidadeId = resCidade.body;
  });

  //
  it("Cria um registro", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId,
      email: "testeCreate@gmail.com",
      nomeCompleto: "Teste Create",
    });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual("number");
  });

  //
  it("Cria um registro 2", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId,
      email: "testeCreate2@gmail.com",
      nomeCompleto: "Teste Create 2",
    });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual("number");
  });

  //
  it("Tenta criar um registro com email duplicado", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId,
      email: "testeCreateDuplicado@gmail.com",
      nomeCompleto: "create duplicado",
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual("number");

    const res2 = await testServer.post("/pessoas").send({
      cidadeId,
      email: "testeCreateDuplicado@gmail.com",
      nomeCompleto: "duplicado",
    });
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toHaveProperty("errors.default");
  });

  //
  it("Tenta criar um registro com nomeCompleto muito curto", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId,
      email: "testeCreate@gmail.com",
      nomeCompleto: "ab",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nomeCompleto");
  });

  //
  it("Tenta criar um registro sem nomeCompleto", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId,
      email: "testeCreate@gmail.com",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nomeCompleto");
  });

  //
  it("Tenta criar um registro sem email", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId,
      nomeCompleto: "Teste Create",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.email");
  });

  //
  it("Tenta criar um registro com email inválido", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId,
      email: "testeCreate gmail.com",
      nomeCompleto: "Teste Create",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.email");
  });

  //
  it("Tenta criar um registro sem cidadeId", async () => {
    const res1 = await testServer.post("/pessoas").send({
      email: "testeCreate@gmail.com",
      nomeCompleto: "Teste Create",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.cidadeId");
  });

  //
  it("Tenta criar um registro com cidadeId inválido", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId: "abc",
      email: "testeCreate@gmail.com",
      nomeCompleto: "Teste Create",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.cidadeId");
  });

  //
  it("Tenta criar um registro sem enviar nenhuma propriedade", async () => {
    const res1 = await testServer.post("/pessoas").send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.cidadeId");
    expect(res1.body).toHaveProperty("errorsResult.body.email");
    expect(res1.body).toHaveProperty("errorsResult.body.nomeCompleto");
  });
});
