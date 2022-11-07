import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - DeleteById", () => {
  //
  it("Deleta um registro", async () => {
    const res1 = await testServer.post("/cidades").send({
      nome: "Cidade de teste",
    });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);

    const resDeleted = await testServer.delete(`/cidades/${res1.body}`).send();
    expect(resDeleted.statusCode).toEqual(StatusCodes.NO_CONTENT);
  });

  //
  it("Tenta deletar um registro que não existe", async () => {
    const res1 = await testServer.delete("/cidades/99999").send();

    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res1.body).toHaveProperty("errors.default");
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
