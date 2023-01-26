import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - UpdateById", () => {
  let accessToken = "";
  beforeAll(async () => {
    const email = "updateById_cidades@gmail.com";

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

  it("Tenta Atualizar um registro pelo id sem o token de acesso", async () => {
    const res1 = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: "Cidade de teste",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resUpdateById = await testServer.put(`/cidades/${res1.body}`).send({
      nome: "Cidade teste",
    });

    expect(resUpdateById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resUpdateById.body).toHaveProperty("errors.default");
  });

  //
  it("Atualiza um registro por id", async () => {
    const res1 = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: "Cidade de teste",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resUpdateById = await testServer
      .put(`/cidades/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: "Cidade teste",
      });

    expect(resUpdateById.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  //
  it("Tenta atualizar um registro que não existe", async () => {
    const res1 = await testServer
      .put("/cidades/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: "Cidade" });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Validação de registro: verifica se o id não é maior que 0", async () => {
    const res1 = await testServer
      .put("/cidades/-1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é do tipo inteiro", async () => {
    const res1 = await testServer
      .put("/cidades/1.25")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é de um tipo válido", async () => {
    const res1 = await testServer
      .put("/cidades/abc")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se a propriedade nome não existe", async () => {
    const res1 = await testServer
      .put("/cidades/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        teste: "asd",
      });
    const res2 = await testServer
      .put("/cidades/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nome");
    expect(res2.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res2.body).toHaveProperty("errorsResult.body.nome");
  });

  //
  it("Validação de registro: verifica se a propriedade nome tem menos de 3 caracteres", async () => {
    const res1 = await testServer
      .put("/cidades/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: "Ci",
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nome");
  });
});
