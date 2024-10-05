const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const checkMembership = async (ctx, next) => {
    try {
        const channelUsername = process.env.CHANNEL_USERNAME;
        if (!channelUsername) {
            console.error('Channel username not found in environment variables.');
            await ctx.reply('Internal error. Please try again later.');
            return;
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
            return;
        }

        return next();
    } catch (error) {
        console.error('Error checking membership:', error);
        await ctx.reply('Error checking channel membership.');
    }
};

module.exports = { checkMembership };
