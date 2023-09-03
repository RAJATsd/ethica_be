const { HfInference } = require("@huggingface/inference");

const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_API;

const inference = new HfInference(HUGGING_FACE_TOKEN);

exports.inference = inference;
