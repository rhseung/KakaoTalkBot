export class KakaoAuthJacker {
    packageName: string;
    decoder: KakaoAuthDecoder;

    constructor(packageName: string) {
        this.packageName = packageName;
        this.decoder = new KakaoAuthDecoder();
    }

    readXML() {
        const basePath = '/data/data/' + this.packageName + '/';
        
        if (!FileUtil.exists(basePath))
            throw new Error('does not exsits for database path');
        
        return org.jsoup.Jsoup.parse(
            FileUtil.read(basePath + 'shared_prefs/KakaoTalk.hw.perferences.xml')
        );
    }

    accessToken() {
        const basePath = '/data/data/' + this.packageName + '/';

        if (!FileUtil.exists(basePath) && !FileUtil.exists(basePath + 'aot'))
            throw new Error('does not exists for auth path');

        return FileUtil.read(basePath + 'aot');
    }

    deviceUUID(xml?: org.jsoup.nodes.Document) {
        if (!xml) xml = this.readXML();
        return xml.select('string[name=d_id]').text(); // not encrypted
    }
}

const FileUtil = {
    write(path: string, value: string) {
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

    read(path: string) {
        const file = new java.io.File(path);

        if (!file.exists()) {
            throw new Error(`File not found: ${path}`);
        }

        const fileReader = new java.io.FileReader(file);
        const reader = new java.io.BufferedReader(fileReader);

        let str: string;
        let arr: string[] = [];
        while ((str = reader.readLine()) != null) {
            arr.push(str);
        }

        return arr.join('\n');
    },

    delete(path: string) {
        const file = new java.io.File(path);

        if (!file.exists()) {
            return false;
        } else {
            file.delete();
            return true;
        }
    },

    exists(path: string) {
        const file = new java.io.File(path);
        return file.exists();
    }
}

export class KakaoAuthDecoder {
    keys1: number[];
    keys2: number[];
    cipher: javax.crypto.Cipher;

    constructor() {
        this.keys1 = [10, 2, 3, -4, 20, 73, 47, -38, 27, -22, 11, -20, -22, 37, 36, 54];
        this.keys2 = [67, 109, -115, -110, -23, 119, 33, 86, -99, -28, -102, 109, -73, 13, 43, -96, 109, -76, 91, -83, 73, -14, 107, -88, 6, 11, 74, 109, 84, -68, -80, 15]; // 알고리즘 직접 구현하는 것보다 딴데에서 구현하고 bytes 채로 받는게 더 빠를듯...
        this.cipher = javax.crypto.Cipher.getInstance('AES/CBC/PKCS5Padding');
        
        this.initCipher();
    }

    initCipher() {
        const secretKey = new javax.crypto.spec.SecretKeySpec(this.keys2, 'AES');
        this.cipher.init(2, secretKey, new javax.crypto.spec.IvParameterSpec(this.keys1)); // decrypt
    }

    decodeToken(token: string) {
        const unwrapBase64 = android.util.Base64.decode(token, 0);
        const decrypted = this.cipher.doFinal(unwrapBase64);
        return new java.lang.String(decrypted, 'UTF-8');
    }
}