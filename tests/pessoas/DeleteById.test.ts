import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("pessoas - DeleteById", () => {
  let accessToken = "";
  beforeAll(async () => {
    const email = "DeleteById_pessoas@gmail.com";
    await testServer.post("/cadastrar").send({
      nome: "Getúlio Vargas",
      email,
      senha: "1234567",
    });
    const signInRes = await testServer.post("/entrar").send({
      email,
      senha: "1234567",
    });

    accessToken = signInRes.body.accessToken;
  });

  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "teste DeleteById" });

    cidadeId = resCidade.body;
  });

  //
  it("Tenta deletar um registro pelo id sem o token de acesso", async () => {
    const res1 = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "testeDelete@gmail.com",
        nomeCompleto: "Teste Delete",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resDeleted = await testServer.delete(`/pessoas/${res1.body}`).send();

    expect(resDeleted.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resDeleted.body).toHaveProperty("errors.default");
  });

  //
  it("Deleta um registro pelo id", async () => {
    const res1 = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "jucadelete@gmail.com",
        nomeCompleto: "Juca silva",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resDeleted = await testServer
      .delete(`/pessoas/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resDeleted.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  //
  it("Tenta deletar um registro que não existe", async () => {
    const res1 = await testServer
      .delete("/pessoas/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Validação de registro: verifica se o id não é maior que 0", async () => {
    const res1 = await testServer
      .delete("/pessoas/-1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é do tipo inteiro", async () => {
    const res1 = await testServer
      .delete("/pessoas/1.25")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é de um tipo válido", async () => {
    const res1 = await testServer
      .delete("/pessoas/abc")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });
});
