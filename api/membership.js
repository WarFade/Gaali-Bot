const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const checkMembership = async (ctx, next) => {
    try {
        const channelUsername = process.env.CHANNEL_USERNAME;
        if (!channelUsername) {
            console.error('Channel Username Not Found In Environment Variables.');
            await ctx.reply('Internal Error. Please Try Again Later.');
            return;
        }

        // Get Chat Member Info
        const member = await ctx.telegram.getChatMember(channelUsername, ctx.from.id);

        // Check If User Is A Member
        const isMember = ['creator', 'administrator', 'member'].includes(member.status);

        if (!isMember) {
            await ctx.reply(
                '⚠️ Please Join Our Channel To Use The Bot!\n\n' +
                'Click The Button Below To Join 👇',
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
        console.error('Error Checking Membership:', error);
        await ctx.reply('Internal Error. Please Try Again Later.');
    }
};

module.exports = { checkMembership };
