let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    hostname: "hattie.db.elephantsql.com",
    database: "cbdwcmmg",
    user: "cbdwcmmg",
    password: "jqxUmoPvIKMOLyoG8tT1uTYBe3_4kz62",
    port: 5432
  };
}

export { config }; 