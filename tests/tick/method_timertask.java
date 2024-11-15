import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import org.json.JSONObject;

public class method_timertask {
    private static final int SIZE = 100;
    private static final int INTERVAL = 1000;
    private static final ArrayList<Integer> X = new ArrayList<>();
    private static final ArrayList<Long> Y = new ArrayList<>();
    private static final long START = System.currentTimeMillis();
    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    static {
        for (int i = 0; i < SIZE; i++) {
            X.add(i);
        }
        Y.add(0L);
    }

    public static void main(String[] args) {
        Timer timer = new Timer();
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                System.out.println(sdf.format(new Date()) + "\t(" + Y.size() + "/" + SIZE + ")");
                if (Y.size() < SIZE) {
                    Y.add(System.currentTimeMillis() - (START + INTERVAL * Y.size()));
                }
            }
        };

        System.out.println(sdf.format(new Date()));
        timer.scheduleAtFixedRate(task, INTERVAL, INTERVAL);

        TimerTask stopTask = new TimerTask() {
            @Override
            public void run() {
                timer.cancel();
                saveData();
            }
        };

        timer.schedule(stopTask, INTERVAL * SIZE + 1000);
    }

    private static void saveData() {
        JSONObject data = new JSONObject();
        data.put("x", X);
        data.put("y", Y);
        data.put("mode", "markers");
        data.put("type", "lines+markers");
        data.put("name", "timertask");

        try (FileWriter file = new FileWriter("./data_timertask.json")) {
            file.write(data.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}