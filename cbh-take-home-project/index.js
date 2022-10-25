const { deterministicPartitionKey } = require("./dpk");

const crypto = require("crypto");
console.log(crypto.createHash("sha3-512").update("hello").digest("hex"))

// console.log(deterministicPartitionKey({ partitionKey: "partition" }));