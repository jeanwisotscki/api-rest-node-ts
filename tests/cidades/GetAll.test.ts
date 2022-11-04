import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - GetAll", () => {
  //
  it("Busca todos os registros", async () => {
    const res1 = await testServer.get("/cidades");

    expect(res1.statusCode).toEqual(StatusCodes.OK);
  });
});
