import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("pessoas - GetAll", () => {
  let cidadeId: number | undefined = undefined;
  beforeAll(async () => {
    const resCidade = await testServer
      .post("/cidades")
      .send({ nome: "teste getAll" });

    cidadeId = resCidade.body;
  });

  //
  it("Busca todos os registros", async () => {
    const res1 = await testServer.post("/pessoas").send({
      cidadeId,
      email: "testeGetAll@gmail.com",
      nomeCompleto: "Teste GetAll",
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetAll = await testServer.get("/pessoas").send();

    expect(Number(resGetAll.header["x-total-count"])).toBeGreaterThan(0);
    expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
    expect(resGetAll.body.length).toBeGreaterThan(0);
  });
});
