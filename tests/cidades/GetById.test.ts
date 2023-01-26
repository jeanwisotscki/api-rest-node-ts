import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - getById", () => {
  let accessToken = "";
  beforeAll(async () => {
    const email = "getById_cidades@gmail.com";

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

  it("Tenta buscar um registro pelo id sem o token de acesso", async () => {
    const res1 = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: "Cidade de teste",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetById = await testServer.get(`/cidades/${res1.body}`).send();

    expect(resGetById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resGetById.body).toHaveProperty("errors.default");
  });

  //
  it("Busca um registro pelo id", async () => {
    const res1 = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: "Cidade de teste",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetById = await testServer
      .get(`/cidades/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(resGetById.statusCode).toEqual(StatusCodes.OK);
    expect(resGetById.body).toHaveProperty("nome");
  });

  //
  it("Busca um registro que não existe", async () => {
    const res1 = await testServer
      .get("/cidades/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Validação de registro: verifica se o id não é maior que 0", async () => {
    const res1 = await testServer
      .get("/cidades/-1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é do tipo inteiro", async () => {
    const res1 = await testServer
      .get("/cidades/1.25")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é de um tipo válido", async () => {
    const res1 = await testServer
      .get("/cidades/abc")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });
});
