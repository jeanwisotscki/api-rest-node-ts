import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("pessoas - getById", () => {
  let accessToken = "";
  beforeAll(async () => {
    const email = "getById_pessoas@gmail.com";
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
      .send({ nome: "teste getById" });

    cidadeId = resCidade.body;
  });

  //
  it("Tenta buscar um registro pelo id sem o token de acesso", async () => {
    const res1 = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "testeGetById@gmail.com",
        nomeCompleto: "Teste GetById",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetById = await testServer.get(`/pessoas/${res1.body}`).send();

    expect(resGetById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resGetById.body).toHaveProperty("errors.default");
  });

  //
  it("Busca um registro por id", async () => {
    const res1 = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "jucadelete@gmail.com",
        nomeCompleto: "Juca silva",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetById = await testServer
      .get(`/pessoas/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resGetById.statusCode).toEqual(StatusCodes.OK);
    expect(resGetById.body).toHaveProperty("nomeCompleto");
  });

  //
  it("Busca um registro que não existe", async () => {
    const res1 = await testServer
      .get("/pessoas/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Validação de registro: verifica se o id não é maior que 0", async () => {
    const res1 = await testServer
      .get("/pessoas/-1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é do tipo inteiro", async () => {
    const res1 = await testServer
      .get("/pessoas/1.25")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é de um tipo válido", async () => {
    const res1 = await testServer
      .get("/pessoas/abc")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });
});
