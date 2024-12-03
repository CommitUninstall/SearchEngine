import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("xposed")
        .setDescription("Replies with list of databreaches")
        .addStringOption(option => option.setName("email").setDescription("The email you want to check").setRequired(true)),

    //loads the xposedornot function from the functions folder    
    async execute(interaction) {
        const query = interaction.options.getString("email");
        const response = await $fetch(`/api/xposedornot?email=${query}`);
        console.log(query);
        console.log(response);
        try {
            if (response.breaches.length > 0) {
                const breachesList = response.breaches[0].join("\n");
                await interaction.reply(`You have been pwned! :( Here are the breaches:\n${breachesList}`);
            } else {
                await interaction.reply("You are safe! :)");
            }
        } catch (error) {
            await interaction.reply(`Error: ${error.message || 'Failed to check for breaches'}`);
        }
    },
};