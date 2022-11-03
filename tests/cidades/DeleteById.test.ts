import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - DeleteById", () => {
  //
  it("Deleta um registro", async () => {
    const res1 = await testServer.delete("/cidades/1");

    expect(res1.statusCode).toEqual(StatusCodes.OK);
  });

  //
  it("Validação de registro: verifica se o id não existe", async () => {
    const res1 = await testServer.delete("/cidades/");

    expect(res1.statusCode).toEqual(StatusCodes.NOT_FOUND);
  });

  //
  it("Validação de registro: verifica se o id não é maior que 0", async () => {
    const res1 = await testServer.delete("/cidades/-1");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é do tipo inteiro", async () => {
    const res1 = await testServer.delete("/cidades/1.25");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é de um tipo válido", async () => {
    const res1 = await testServer.delete("/cidades/abc");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });
});
