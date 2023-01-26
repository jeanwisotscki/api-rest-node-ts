import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - GetAll", () => {
  let accessToken = "";
  beforeAll(async () => {
    const email = "getAll_cidades@gmail.com";

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

  it("Tenta buscar todos os registro sem o token de acesso", async () => {
    const res1 = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: "Cidade de teste",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetAll = await testServer.get("/cidades").send();

    expect(resGetAll.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    expect(resGetAll.body).toHaveProperty("errors.default");
  });

  //
  it("Busca todos os registros", async () => {
    const res1 = await testServer
      .post("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: "Cidade de teste",
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetAll = await testServer
      .get("/cidades")
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(Number(resGetAll.header["x-total-count"])).toBeGreaterThan(0);
    expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
    expect(resGetAll.body.length).toBeGreaterThan(0);
  });
});
