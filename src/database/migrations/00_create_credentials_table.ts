import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("credentials", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable();
    table.string("password").notNullable();
    table.string("token").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropSchema("credentials");
}
