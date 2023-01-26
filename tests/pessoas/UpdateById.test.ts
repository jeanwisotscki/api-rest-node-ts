import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("pessoas - UpdateById", () => {
  let accessToken = "";
  beforeAll(async () => {
    const email = "UpdateById_pessoas@gmail.com";
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
      .send({ nome: "teste UpdateById" });

    cidadeId = resCidade.body;
  });

  //
  it("Tenta atualizar um registro pelo id sem o token de acesso", async () => {
    const res1 = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "testeUpdateById@gmail.com",
        nomeCompleto: "Teste UpdateById",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resUpdateById = await testServer.put(`/pessoas/${res1.body}`).send({
      cidadeId,
      email: "testeUpdateById2@gmail.com",
      nomeCompleto: "Teste UpdateById",
    });

    expect(resUpdateById.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resUpdateById.body).toHaveProperty("errors.default");
  });

  //
  it("Atualiza um registro por id", async () => {
    const res1 = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "jucadelete@gmail.com",
        nomeCompleto: "Juca silva",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resUpdateById = await testServer
      .put(`/pessoas/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "testeUpdateById2@gmail.com",
        nomeCompleto: "Teste UpdateById",
      });

    expect(resUpdateById.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  //
  it("Tenta atualizar um registro que não existe", async () => {
    const res1 = await testServer
      .put("/pessoas/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "testeUpdateById3@gmail.com",
        nomeCompleto: "Teste UpdateById",
      });

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Validação de registro: verifica se o id não é maior que 0", async () => {
    const res1 = await testServer
      .put("/pessoas/-1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é do tipo inteiro", async () => {
    const res1 = await testServer
      .put("/pessoas/1.25")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é de um tipo válido", async () => {
    const res1 = await testServer
      .put("/pessoas/abc")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se a propriedade nomeCompleto não existe", async () => {
    const res1 = await testServer
      .put("/pessoas/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "testeUpdateById4@gmail.com",
        nome: "teste teste",
      });
    const res2 = await testServer
      .put("/pessoas/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nomeCompleto");
    expect(res2.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res2.body).toHaveProperty("errorsResult.body.nomeCompleto");
  });

  //
  it("Validação de registro: verifica se a propriedade nomeCompleto tem menos de 3 caracteres", async () => {
    const res1 = await testServer
      .put("/pessoas/1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "testeUpdateById5@gmail.com",
        nomeCompleto: "ab",
      });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nomeCompleto");
  });
});
