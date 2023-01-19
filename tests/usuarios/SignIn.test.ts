import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("usuarios - SignIn", () => {
  beforeAll(async () => {
    await testServer.post("/cadastrar").send({
      nome: "teste de sign in",
      email: "signin@email.com",
      senha: "teste123",
    });
  });

  //
  it("Faz login", async () => {
    const res1 = await testServer.post("/entrar").send({
      senha: "teste123",
      email: "signin@email.com",
    });

    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(res1.body).toHaveProperty("accessToken");
  });

  //
  it("Senha errada", async () => {
    const res1 = await testServer.post("/entrar").send({
      senha: "teste1234",
      email: "signin@email.com",
    });

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Senha menor que 6", async () => {
    const res1 = await testServer.post("/entrar").send({
      senha: "teste",
      email: "signin@email.com",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.senha");
  });

  //
  it("Senha não informada", async () => {
    const res1 = await testServer.post("/entrar").send({
      // senha: "teste",
      email: "signin@email.com",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.senha");
  });

  //
  it("Email inexistente", async () => {
    const res1 = await testServer.post("/entrar").send({
      senha: "teste123",
      email: "signin123@email.com",
    });

    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(res1.body).toHaveProperty("errors.default");
  });

  //
  it("Formato do email inválido", async () => {
    const res1 = await testServer.post("/entrar").send({
      senha: "teste123",
      email: "signin email.com",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.email");
  });

  //
  it("Email não informado", async () => {
    const res1 = await testServer.post("/entrar").send({
      senha: "teste123",
      // email: "signin@email.com",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.email");
  });
});
