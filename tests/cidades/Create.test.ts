import { testServer } from "../jest.setup";
import { StatusCodes } from "http-status-codes";

describe("cidades - Create", () => {
  //
  it("Cria um registro", async () => {
    const res1 = await testServer.post("/cidades").send({
      nome: "Cidade de teste",
    });

    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual("number");
  });

  //
  it("Validação de registro: verifica se a propriedade nome não existe", async () => {
    const res1 = await testServer.post("/cidades").send({
      teste: "asd",
    });
    const res2 = await testServer.post("/cidades").send({});

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nome");
    expect(res2.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res2.body).toHaveProperty("errorsResult.body.nome");
  });

  //
  it("Validação de registro: verifica se a propriedade nome tem menos de 3 caracteres", async () => {
    const res1 = await testServer.post("/cidades").send({
      nome: "Ci",
    });

    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty("errorsResult.body.nome");
  });
});
