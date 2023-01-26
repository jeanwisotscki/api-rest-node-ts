import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - DeleteById", () => {
  let accessToken = "";
  beforeAll(async () => {
    const email = "deleteById_cidades@gmail.com";

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

  it("Tenta deletar um registro sem o token de acesso", async () => {
    const res1 = await testServer.delete("/cidades/1").send();

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Deleta um registro", async () => {
    const res1 = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: "Cidade de teste",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resDeleted = await testServer
      .delete(`/cidades/${res1.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(resDeleted.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  //
  it("Tenta deletar um registro que não existe", async () => {
    const res1 = await testServer
      .delete("/cidades/99999")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Validação de registro: verifica se o id não é maior que 0", async () => {
    const res1 = await testServer
      .delete("/cidades/-1")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é do tipo inteiro", async () => {
    const res1 = await testServer
      .delete("/cidades/1.25")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é de um tipo válido", async () => {
    const res1 = await testServer
      .delete("/cidades/abc")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });
});
