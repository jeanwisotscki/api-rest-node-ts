import { Knex } from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("cidade", (table) => {
    table.bigIncrements("id").primary().index();
    table.string("nome", 150).index().notNullable();

    table.comment("Tabela usada para armazenar cidades do sistema.");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("cidade");
}
