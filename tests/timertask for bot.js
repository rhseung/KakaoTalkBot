const bot = BotManager.getCurrentBot();

const Timer = java.util.Timer;
const TimerTask = java.util.TimerTask;

var timer = new Timer();

bot.addListener(Event.START_COMPILE, () => {
    timer.cancel();
});

bot.addListener('message', msg => {
    if (msg.content === 'stop') {
        timer.cancel();
    }
    else if (msg.content === 'start') {
        timer.scheduleAtFixedRate(new TimerTask({
            run: () => {
                Log.d(new Date().getMilliseconds());
            }
        }), 0, 1000);
    }
});