let CACHE = [];
export class YubinBangoCore {
    URL = 'https://yubinbango.github.io/yubinbango-data/data';
    REGION = [
        '', '北海道', '青森県', '岩手県', '宮城県',
        '秋田県', '山形県', '福島県', '茨城県', '栃木県',
        '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
        '新潟県', '富山県', '石川県', '福井県', '山梨県',
        '長野県', '岐阜県', '静岡県', '愛知県', '三重県',
        '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県',
        '和歌山県', '鳥取県', '島根県', '岡山県', '広島県',
        '山口県', '徳島県', '香川県', '愛媛県', '高知県',
        '福岡県', '佐賀県', '長崎県', '熊本県', '大分県',
        '宮崎県', '鹿児島県', '沖縄県'
    ];
    constructor(inputPostalCd = '', callback) {
        if (inputPostalCd) {
            const a = inputPostalCd.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 65248));
            const b = a.match(/\d/g);
            const c = b.join('');
            const yubin7 = this.chk7(c);
            if (yubin7) {
                this.getAddr(yubin7, callback);
            }
            else {
                callback(this.addrDic());
            }
        }
    }
    chk7(val) {
        if (val.length === 7) {
            return val;
        }
    }
    addrDic(region_id = 0, region = '', locality = '', street = '', extended = '') {
        return {
            'region_id': region_id,
            'region': region,
            'locality': locality,
            'street': street,
            'extended': extended
        };
    }
    selectAddr(addr) {
        if (addr && addr[0] && addr[1]) {
            return this.addrDic(Number(addr[0]), this.REGION[Number(addr[0])], addr[1], addr[2], addr[3]);
        }
        else {
            return this.addrDic();
        }
    }
    jsonp(url, fn) {
        (window).$yubin = (data) => fn(data);
        const scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute("charset", "UTF-8");
        scriptTag.setAttribute("src", url);
        document.head.appendChild(scriptTag);
    }
    getAddr(yubin7, fn) {
        const yubin3 = Number(yubin7.substring(0, 3));
        if (yubin3 in CACHE && yubin7 in CACHE[yubin3]) {
            return fn(this.selectAddr(CACHE[yubin3][Number(yubin7)]));
        }
        else {
            this.jsonp(`${this.URL}/${yubin3}.js`, (data) => {
                CACHE[yubin3] = data;
                return fn(this.selectAddr(data[Number(yubin7)]));
            });
        }
    }
}
