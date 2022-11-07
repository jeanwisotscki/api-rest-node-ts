import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - GetAll", () => {
  //
  it("Busca todos os registros", async () => {
    const res1 = await testServer.post("/cidades").send({
      nome: "Cidade de teste",
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resGetAll = await testServer.get("/cidades").send();

    expect(Number(resGetAll.header["x-total-count"])).toBeGreaterThan(0);
    expect(resGetAll.statusCode).toEqual(StatusCodes.OK);
    expect(resGetAll.body.length).toBeGreaterThan(0);
  });
});
