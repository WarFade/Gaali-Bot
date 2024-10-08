const { Telegraf } = require('telegraf');
const { checkMembership } = require('./membership');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  if (!ctx.message && !ctx.callbackQuery) return next();

  const isMember = await checkMembership(ctx);
  if (isMember) {
    return next();
  }
});;

bot.on('text', async (ctx) => {
    await ctx.reply('Under Development.');
});

bot.catch((err, ctx) => {
    console.error(`Error For ${ctx.updateType}`, err);
});

module.exports = async (request, response) => {
    try {
        const { body, method } = request;

        if (method !== 'POST') {
            response.status(200).json({ message: 'Bot Is Running!' });
            return;
        }
        await bot.handleUpdate(body);
        response.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error In Webhook Handler:', error);
        response.status(500).json({ error: 'Failed To Process Update.' });
    }
};
