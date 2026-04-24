const crypto = require("crypto");

const ALPHABET_36 = "0123456789abcdefghijklmnopqrstuvwxyz";
const ALPHABET_62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

class ShortIdGenerator {
  constructor(options = {}) {
    this.options = {
      length: options.length || 6,
      alphabet: options.alphabet || ALPHABET_62,
      algorithm: options.algorithm || "sha256",
    };
  }

  /**
   * @param {string} input
   * @param {string | { salt?: string } | undefined} [saltOrOptions]  可选；字符串等价于 { salt: ... }。有 salt 时与无 salt 时不同 ID。
   */
  generate(input, saltOrOptions) {
    const { salt } = this._parseSalt(saltOrOptions);
    const hash = this._createHash();
    this._updateInput(hash, input, salt);
    const digestHex = hash.digest("hex");
    return this._encodeHexToShortId(digestHex);
  }

  _parseSalt(saltOrOptions) {
    if (saltOrOptions == null || saltOrOptions === "") {
      return { salt: "" };
    }
    if (typeof saltOrOptions === "string") {
      return { salt: saltOrOptions };
    }
    if (typeof saltOrOptions === "object" && "salt" in saltOrOptions) {
      return { salt: String(saltOrOptions.salt ?? "") };
    }
    return { salt: "" };
  }

  _createHash() {
    return crypto.createHash(this.options.algorithm);
  }

  _updateInput(hash, input, salt) {
    const str = String(input);
    hash.update(str, "utf8");
    if (salt) {
      hash.update("\0", "utf8");
      hash.update(String(salt), "utf8");
    }
  }

  _encodeHexToShortId(hex) {
    let number = BigInt(`0x${hex}`);
    let shortId = "";
    const alphabetLength = BigInt(this.options.alphabet.length);

    while (shortId.length < this.options.length) {
      const remainder = number % alphabetLength;
      shortId = this.options.alphabet[Number(remainder)] + shortId;
      number = number / alphabetLength;
    }

    return shortId;
  }

  /**
   * 对同一 input 的另一种截断式编码（与 {@link #generate} 的定长 base-N 不同，勿与 generate 混作同一套 ID 空间）。
   * @param {string} input
   * @param {string | { salt?: string } | undefined} [saltOrOptions]
   */
  generateUrlSafe(input, saltOrOptions) {
    const { salt } = this._parseSalt(saltOrOptions);
    const hash = this._createHash();
    this._updateInput(hash, input, salt);
    return hash
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
      .slice(0, this.options.length);
  }
}

module.exports = ShortIdGenerator;
module.exports.ALPHABET_36 = ALPHABET_36;
module.exports.ALPHABET_62 = ALPHABET_62;
