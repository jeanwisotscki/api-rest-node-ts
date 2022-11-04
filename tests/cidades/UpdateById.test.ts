import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - UpdateById", () => {
  //
  it("Edita um registro", async () => {
    const res1 = await testServer.put("/cidades/1").send({
      nome: "Cidade de teste",
    });

    expect(res1.statusCode).toEqual(StatusCodes.OK);
    expect(typeof res1.body).toEqual("number");
  });

  //
  it("Validação de registro: verifica se o id não é maior que 0", async () => {
    const res1 = await testServer.put("/cidades/-1");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é do tipo inteiro", async () => {
    const res1 = await testServer.put("/cidades/1.25");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se o id não é de um tipo válido", async () => {
    const res1 = await testServer.put("/cidades/abc");

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.params.id");
  });

  //
  it("Validação de registro: verifica se a propriedade nome não existe", async () => {
    const res1 = await testServer.put("/cidades/1").send({
      teste: "asd",
    });
    const res2 = await testServer.put("/cidades/1").send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nome");
    expect(res2.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res2.body).toHaveProperty("errorsResult.body.nome");
  });

  //
  it("Validação de registro: verifica se a propriedade nome tem menos de 3 caracteres", async () => {
    const res1 = await testServer.put("/cidades/1").send({
      nome: "Ci",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nome");
  });
});
