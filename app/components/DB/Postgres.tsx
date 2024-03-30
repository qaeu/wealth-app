"use server";

import { sql } from "@vercel/postgres";

type Value = {
  lower_bound: number;
  upper_bound: number;
};

type Options = {
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
};

export const queryValue = async (item: string) => {
  const rowcount = await sql`SELECT COUNT(*) FROM values WHERE item = ${item};`;
  if (rowcount.rows[0].count > 0) {
    const { rows } = await sql<Value>`SELECT lower_bound, upper_bound
    FROM values WHERE item = ${item} LIMIT 1;`;
    const value = rows[0];

    return [value.lower_bound, value.upper_bound];
  }

  return null;
};

export const insertValue = (item: string, value: number[]) => {
  sql`INSERT INTO values 
    (item, lower_bound, upper_bound)
    VALUES (
      ${item}, ${value[0]}, ${value[1]}
    );`;
};

export const queryOptions = async (item: string) => {
  const rowcount =
    await sql`SELECT COUNT(*) FROM options WHERE item = ${item};`;
  if (rowcount.rows[0].count > 0) {
    const { rows } =
      await sql<Options>`SELECT option_1, option_2, option_3, option_4 
    FROM options WHERE item = ${item} LIMIT 1;`;
    const options = rows[0];

    return [
      options.option_1,
      options.option_2,
      options.option_3,
      options.option_4,
    ];
  }

  return null;
};

export const insertOptions = (item: string, options: string[]) => {
  sql`INSERT INTO options 
    (item, option_1, option_2, option_3, option_4) 
    VALUES (
      ${item}, ${options[0]}, ${options[1]}, ${options[2]}, ${options[3]}
    );`;
};
