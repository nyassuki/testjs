require("dotenv").config();
const { Buffer } = require("buffer");
const CoinKey = require("coinkey");
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "7413053009:AAGMiHOUPW8l3i2SJERw2kQubG3ICWl6Hdo";
const CHAT_ID = 7615664261;

if (!TOKEN || !CHAT_ID) {
  console.error("Error: Missing Telegram Bot Token or Chat ID in .env file.");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

const START_FROM = fs.existsSync("progress.log")
  ? fs.readFileSync("progress.log", "utf8").trim()
  : "0";
console.log("🤖 Telegram bot is running...");
console.log("Starting from:", START_FROM);
bot.sendMessage(CHAT_ID, "Bot Started");

function startBot() {
	bot.onText(/\/start/, (msg) => {
	  bot.sendMessage(msg.chat.id, "Welcome to my bot!");
	});
	bot.onText(/\/gotest/, (msg) => {
	  bot.sendMessage(msg.chat.id, "Welcome to my bot!");
	});
	bot.onText(/\/start_run/, (msg) => {
	  bot.sendMessage(msg.chat.id, "Bot ruunning search mode ..... !");
	  
	});
}

function mainStart(startFrom) {
  try {
    let count = BigInt(startFrom);
    const one = BigInt(16);
    const padded = Buffer.alloc(32);
    const foundFile = "found/rns_found_balance2.txt";

    const targetAddresses = new Set([
      "1KTvsW5tg5gkJf9fyT2xsvjkv7dzuZNTpW",
      "15ANYzzCp5BFHcCnVFzXqyibpzgPLWaD8b",
      "1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF",
      "1LdRcdxfbSnmCYYNdeYpUnztiYzVfBEQeC",
      "1AC4fMwgY8j9onSbXEWeH6Zan8QGMSdmtA",
      "1LruNZjwamWJXThX2Y8C2d47QqhAkkc5os",
      "12ib7dApVFvg82TXKycWBNpN8kFyiAN1dr",
      "12tkqA9xSoowkzoERHMWNKsTey55YEBqkv",
      "17rm2dvb439dZqyMe2d4D6AQJSgg6yeNRn",
      "1PeizMg76Cf96nUQrYg8xuoZWLQozU5zGW",
      "1GR9qNz7zgtaW5HwwVpEJWMnGWhsbsieCG",
      "1F34duy2eeMz5mSrvFepVzy7Y1rBsnAyWC",
      "1CmN5TcT7FF7H1DotF2ZKqYs1zKNncsHiS",
      "1P8Fbsd4YFd5TYpkK9Aij393T7dBvXLzYs",
      "1KSA4GFxSKdQkDA9ii8cy6ECBFPBGx9QKq",
    ]);

    while (true) {
      count += one;

      // Update progress every 1000 iterations to reduce disk stress
      fs.writeFileSync("progress.log", "" + count);

      const countHex = count.toString(16);
      const countBytes = Buffer.from(countHex.padStart(64, "0"), "hex");
      countBytes.copy(padded);

      const key1 = new CoinKey(padded);
      const PrivateKey = key1.privateKey.toString("hex");
      const PublicAddress = key1.publicAddress;

      console.log(`${count} -> ${PrivateKey}, ${PublicAddress}`);

      if (targetAddresses.has(PublicAddress)) {
        const resultKey = `🚀 BTC Key Found: ${count} -> ${PrivateKey} -> ${PublicAddress}\n`;
        fs.appendFileSync(foundFile, resultKey, { encoding: "utf8" });

        bot.sendMessage(CHAT_ID, resultKey);
      }
    }
  } catch (error) {
    console.error("Error in main loop:", error);
  }
}
mainStart(START_FROM);
exports.module= {startBot}
