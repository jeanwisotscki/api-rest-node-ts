import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("pessoas - GetAll", () => {
  let accessToken = "";
  beforeAll(async () => {
    const email = "GetAll_pessoas@gmail.com";
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
      .send({ nome: "teste GetAll" });

    cidadeId = resCidade.body;
  });

  //
  it("Tenta buscar todos os registros sem o token de acesso", async () => {
    const res1 = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "testeGetAll@gmail.com",
        nomeCompleto: "Teste GetAll",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetAll = await testServer.get("/pessoas").send();

    expect(resGetAll.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resGetAll.body).toHaveProperty("errors.default");
  });

  //
  it("Busca todos os registros", async () => {
    const res1 = await testServer
      .post("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        cidadeId,
        email: "jucadelete@gmail.com",
        nomeCompleto: "Juca silva",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetAll = await testServer
      .get("/pessoas")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(Number(resGetAll.header["x-total-count"])).toBeGreaterThan(0);
    expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
    expect(resGetAll.body.length).toBeGreaterThan(0);
  });
});
