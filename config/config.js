let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    hostname: "hattie.db.elephantsql.com",
    database: "vmdsmcnh",
    user: "vmdsmcnh",
    password: "ZRPTqWj6Sdy3mOBGj_hYh0fo_86QhW5F",
    port: 5432
  };
}

export { config }; 