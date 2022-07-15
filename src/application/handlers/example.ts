// const rds = new AWS.RDSDataService()
// const db = await rds
// .executeStatement({
//   secretArn: process.env.SECRET_ARN!,
//   resourceArn: process.env.PGDBCLUSTERARN!,
//   database: process.env.PGDATABASE,
//   sql: `
// CREATE TABLE IF NOT EXISTS foo (
//   foo_id int PRIMARY KEY
// );
// `,
// })
// .promise()