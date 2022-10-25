const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the original partitionKey when given a string partitionKey less than 256", () => {
    const original = "partition"
    const trivialKey = deterministicPartitionKey({ partitionKey: original });
    expect(trivialKey).toBe(original);
  });

  it("Returns the sha-3 hashed version of the oirginal partitionKey when given a string partitionKey bigger than 256", () => {
    const original = "key".repeat(256)
    const trivialKey = deterministicPartitionKey({ partitionKey: original });
    expect(trivialKey).toBe("9f644e24a538e5ed51727caa4c65e5f6a6d3a62a4c07235cf49085802059fa0e2ce30426c876ad5522c4e258da4ce9fb0bcf6df8b219290ca20a1d8c09323790");
  });

  it("Returns the stringify version / hashed version when given partitionKey is not a string", () => {
    const original = { a: "hello" }
    const trivialKey = deterministicPartitionKey({ partitionKey: original });
    expect(trivialKey).toBe("{\"a\":\"hello\"}");

    const originalLong = { a: "key".repeat(256) }
    const trivialKeyHashed = deterministicPartitionKey({ partitionKey: originalLong });
    expect(trivialKeyHashed).toBe("55a8508e5148d40df7b47cdaa04c6f771ed562ad179f3490186c6cb27473568454496f8c653a0c093dd03b000913e7c92fdd25ef6b9ac54169391e7434e60cc6");
  });

  it("Returns sha-3 hashed evrsion of the input when the partitionKey is not given", () => {
    const event = { other: 'hello' }
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe("fd19b8fb3e7479268919a34b87aa99b499945c2d8afe821f00a1a03c0637eee7755e59c98e065b58d619df170557aaeec079a9f806556113606fcfe71e77b296");
  });
});
