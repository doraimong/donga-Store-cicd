// index.js? mongoose.connect("mongodb://localhost:27017/") ? μ£Όμ? ? λ³? λ³΄μ? ??΄ ?ΈλΆ?? ??¬?μ§? ??λ‘? ???° local?Ό? dev, λ°°ν¬ ??? prod?? ???μ²λ?Όν?€.
if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
