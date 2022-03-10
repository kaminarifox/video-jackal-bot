const fs = require('fs');
const https = require('https');
const { exec } = require("child_process");
const crypto  = require("crypto");
const { Telegraf } = require('telegraf');
const path = require("path");

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: {
        apiRoot: 'http://telegram-bot-api:8081'
    }
})

bot.on('video', ctx => {
    if (ctx.update?.message?.video) {
        handleNewVideo(ctx);
    } else {
        ctx.reply("Video source not found ☹️")
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

// async function downloadFile(url) {
//     return new Promise((resolve, reject) => {
//         https.get(url.href, res => {
//             const filename = STORAGE_PATH + '/' + crypto.randomBytes(20).toString('hex') + '.mp4';
//             const file = fs.createWriteStream(filename);
//             res.pipe(file)
//                 .on('finish', () => {
//                     resolve(filename);
//                 })
//             res.on('error', err => {
//                 reject(err);
//             })
//         });
//     })
// }


bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
