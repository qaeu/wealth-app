"use server";

import { sql } from "@vercel/postgres";

type Options = {
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
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
