import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("pessoas - DeleteById", () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post("/cidades")
      .send({ nome: "teste DeleteById" });

    cidadeId = resCidade.body;
  });

  //
  it("Deleta um registro", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId,
      email: "testeDelete@gmail.com",
      nomeCompleto: "Teste Delete",
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resDeleted = await testServer.delete(`/pessoas/${res1.body}`).send();
    expect(resDeleted.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  //
  it("Tenta deletar um registro que não existe", async () => {
    const res1 = await testServer.delete("/pessoas/99999").send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Validação de registro: verifica se o id não é maior que 0", async () => {
    const res1 = await testServer.delete("/pessoas/-1");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é do tipo inteiro", async () => {
    const res1 = await testServer.delete("/pessoas/1.25");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é de um tipo válido", async () => {
    const res1 = await testServer.delete("/pessoas/abc");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });
});
