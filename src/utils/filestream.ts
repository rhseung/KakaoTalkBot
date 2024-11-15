export const Filestream = {
    write(path: string, value: string): void {
        const file = new java.io.File(path);

        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
        }

        const fileWriter = new java.io.FileWriter(file);
        const writer = new java.io.BufferedWriter(fileWriter);

        writer.write(value);
        writer.close();
    },

    writeObject(path: string, value: object): void {
        return Filestream.write(path, JSON.stringify(value));
    },

    read(path: string): string {
        const file = new java.io.File(path);

        if (!file.exists()) {
            throw new Error(`File not found: ${path}`);
        }

        const fileReader = new java.io.FileReader(file);
        const reader = new java.io.BufferedReader(fileReader);

        let str: string;
        let arr: string[] = [];

        while ((str = reader.readLine()) != null) {
            arr.push(String(str));
        }

        return arr.join('\n');
    },

    readObject(path: string): object {
        return JSON.parse(Filestream.read(path));
    },

    delete(path: string): boolean {
        const file = new java.io.File(path);

        if (!file.exists()) {
            return false;
        } else {
            file.delete();
            return true;
        }
    },

    exists(path: string): boolean {
        const file = new java.io.File(path);

        return file.exists();
    },

    listFiles(path: string): java.io.File[] {
        const file = new java.io.File(path);

        return file.listFiles();
    }
}