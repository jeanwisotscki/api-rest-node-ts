import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("pessoas - getById", () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post("/cidades")
      .send({ nome: "teste GetById" });

    cidadeId = resCidade.body;
  });

  //
  it("Busca um registro por id", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId,
      email: "testeGetById@gmail.com",
      nomeCompleto: "Teste GetById",
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetById = await testServer.get(`/pessoas/${res1.body}`).send();

    expect(resGetById.statusCode).toEqual(StatusCodes.OK);
    expect(resGetById.body).toHaveProperty("nomeCompleto");
  });

  //
  it("Busca um registro que não existe", async () => {
    const res1 = await testServer.get("/pessoas/99999").send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Validação de registro: verifica se o id não é maior que 0", async () => {
    const res1 = await testServer.get("/pessoas/-1");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é do tipo inteiro", async () => {
    const res1 = await testServer.get("/pessoas/1.25");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é de um tipo válido", async () => {
    const res1 = await testServer.get("/pessoas/abc");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });
});
