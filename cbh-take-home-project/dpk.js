const crypto = require("crypto");
const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

const generateHash = (data) => crypto.createHash("sha3-512").update(data).digest("hex")

exports.deterministicPartitionKey = (event) => {
  if (!event) {
    return TRIVIAL_PARTITION_KEY
  }

  const { partitionKey } = event

  if (!partitionKey) {
    return generateHash(JSON.stringify(event))
  }

  const candidate = typeof partitionKey === "string" ? partitionKey : JSON.stringify(partitionKey);
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    return generateHash(candidate)
  }
  return candidate
};