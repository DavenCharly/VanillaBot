import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import express from "express";
dotenv.config();

// Web server so Vanilla doesn’t  deadge
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Vanilla is awake and ready to win!");
});

app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`);
});

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const prefix = "!!";

client.once("ready", () => {
    console.log(`${client.user.tag} is online and ready to win. ✌️`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();


    //---------------------
    //Rock, Paper, Scissors
    //---------------------
    if (command === "rps") {
        if (!args[0]) {
            return message.reply("You should choose `rock`, `paper`, or `scissors`!");
        }

        const userChoice = args[0].toLowerCase();
        const choices = ["rock", "paper", "scissors"];
        if (!choices.includes(userChoice)) {
            return message.reply("No cheating. Choose `rock`, `paper`, or `scissors`.");
        }

        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        let result = "";

        if (userChoice === botChoice) {
            result = "Tied. One more?";
        } else if (
            (userChoice === "rock" && botChoice === "scissors") ||
            (userChoice === "paper" && botChoice === "rock") ||
            (userChoice === "scissors" && botChoice === "paper")
        ) {
            result = `I lost..`;
        } else {
            result = `Victory for me. ✌️`;
        }

        await message.reply(`You chose **${userChoice}**\nI chose **${botChoice}**\n${result}`);
    }
});

// Token login with error handling
client.login(process.env.BOT_TOKEN).catch((err) => {
    console.error("❌ Failed to log in! Check BOT_TOKEN.", err);
});
