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
    .setName("image")
    .setDescription(
      "Post your image description and receive the image created by OpenAI."
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The message for the AI.")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const imageDescription = interaction.options.getString("description");
      await interaction.deferReply({ ephemeral: true });

      const response = await openai.createImage({
        prompt: imageDescription,
        n: 1,
        size: "1024x1024",
      });

      await interaction.editReply(response.data.data[0].url);
    } catch (error) {
      console.error(error);
      await interaction.editReply("something went wrong!");
    }
  },
};
