const { Markup } = require('telegraf');
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const checkMembership = async (ctx) => {
    try {
        const channelUsername = process.env.CHANNEL_USERNAME;
        if (!channelUsername) {
            console.error('Channel username not found in environment variables.');
            await ctx.reply('Internal error. Please try again later.');
            return false;
        }

        // Get Chat Member Info
        const member = await ctx.telegram.getChatMember(channelUsername, ctx.from.id);

        // Check If User Is A Member
        const isMember = ['creator', 'administrator', 'member'].includes(member.status);

        if (!isMember) {
            await ctx.reply(
                '⚠️ Please join our channel to use the bot!\n\n' +
                'Click the button below to join:',
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🔔 Join Channel', url: `https://t.me/${channelUsername.replace('@', '')}` }]
                        ]
                    }
                }
            );
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking membership:', error);
        await ctx.reply('Error checking channel membership.');
        return false;
    }
};

// Check Membership Before Executing Commands
bot.use(async (ctx, next) => {
    const isMember = await checkMembership(ctx);
    if (isMember) {
        return next();
    }
});

module.exports = { checkMembership };
