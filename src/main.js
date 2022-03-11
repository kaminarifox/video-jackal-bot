const crypto  = require("crypto");
const { exec } = require("child_process");
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: {
        apiRoot: 'http://telegram-bot-api:8081'
    }
});

bot.on('video', ctx => {
    if (ctx.update?.message?.video) {
        ctx.reply('Processing...');
        handleNewVideo(ctx);
    } else {
        ctx.reply("Video source not found ☹️");
    }
})

async function handleNewVideo(ctx) {
    const file = await ctx.telegram.getFile(ctx.update.message.video.file_id);

    compressVideo(file.file_path).then(compressedPath => {
        console.log(compressedPath);
        ctx.replyWithVideo({ source: compressedPath });
    });
}

async function compressVideo(path) {
    const outPath = '/tmp/videos/' + crypto.randomBytes(12).toString('hex') + '.mp4'
    return new Promise((resolve, reject) => {
        exec(`sh ${__dirname}/scripts/compress.sh 1 ${path} ${outPath}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }

            resolve(stdout.trim());
        });
    });
}

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
