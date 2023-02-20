const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();
const { OPENAI_API_KEY } = process.env;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Post your question and receive the answer.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message for the AI.")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const message = interaction.options.getString("message") ?? "Test.";
      await interaction.deferReply({ ephemeral: true });

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature: 0.9,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: [" Human:", " AI:"],
      });

      console.log(response);

      await interaction.editReply(response.data.choices[0].text);
    } catch (error) {
      console.error(error);
    }
  },
};
