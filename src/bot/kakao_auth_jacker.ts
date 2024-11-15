import { Filestream as fs } from "../utils/filestream";

export class KakaoAuthJacker {
    packageName: string;
    decoder: KakaoAuthDecoder;

    constructor(packageName: string) {
        this.packageName = packageName;
        this.decoder = new KakaoAuthDecoder();
    }

    readXML(): org.jsoup.nodes.Document {
        const basePath = '/data/data/' + this.packageName + '/';
        
        if (!fs.exists(basePath))
            throw new Error('does not exsits for database path');
        
        return org.jsoup.Jsoup.parse(
            fs.read(basePath + 'shared_prefs/KakaoTalk.hw.perferences.xml')
        );
    }

    accessToken(): string {
        const basePath = '/data/data/' + this.packageName + '/';

        if (!fs.exists(basePath) && !fs.exists(basePath + 'aot'))
            throw new Error('does not exists for auth path');

        return fs.read(basePath + 'aot');
    }

    deviceUUID(xml?: org.jsoup.nodes.Document): string {
        if (!xml) xml = this.readXML();

        return xml.select('string[name=d_id]').text(); // not encrypted
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

    decodeToken(token: string): java.lang.String {
        const unwrapBase64 = android.util.Base64.decode(token, 0);
        const decrypted = this.cipher.doFinal(unwrapBase64);
        return new java.lang.String(decrypted, 'UTF-8');
    }
}