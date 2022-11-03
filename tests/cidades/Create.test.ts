import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - Create", () => {
  //
  it("Cria um registro", async () => {
    const res1 = await testServer.post("/cidades").send({
      nome: "Guaramirim",
    });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual("number");
  });
});
