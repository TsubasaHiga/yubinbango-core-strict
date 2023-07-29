// [郵便番号上3桁][郵便番号][3(県コード、市区町村等)]
let CACHE = [] as string[][][];
export interface Addr {
    /** 県id 1~47 */
    region_id: number
    /** 都道府県 */
    region: string
    /** 市区町村 */
    locality: string
    /** 番地等 */
    street: string
    /** その他拡張用 */
    extended: string
}
// module YubinBango {
export class YubinBangoCore {
    URL = 'https://yubinbango.github.io/yubinbango-data/data';
    REGION: string[] = [
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
    constructor(inputPostalCd: string = '', callback: (addr: Addr) => void) {
        if (inputPostalCd) {
            // 全角の数字を半角に変換 ハイフンが入っていても数字のみの抽出
            const a: string = inputPostalCd.replace(/[０-９]/g, (s: string) => String.fromCharCode(s.charCodeAt(0) - 65248));
            const b: RegExpMatchArray = a.match(/\d/g)!;
            const c: string = b.join('');
            const yubin7: string = this.chk7(c)!;
            // 7桁の数字の時のみ作動
            if (yubin7) {
                this.getAddr(yubin7, callback);
            } else {
                callback(this.addrDic());
            }
        }
    }
    chk7(val: string) {
        if (val.length === 7) {
            return val;
        }
    }
    addrDic(region_id = 0, region = '', locality = '', street = '', extended = ''): Addr {
        return {
            'region_id': region_id,
            'region': region,
            'locality': locality,
            'street': street,
            'extended': extended
        };
    }
    /**
     *
     * @param addr [0]:pref_id [1]:市 [2]:町
     */
    selectAddr(addr: string[]): Addr {
        if (addr && addr[0] && addr[1]) {
            return this.addrDic(Number(addr[0]), this.REGION[Number(addr[0])], addr[1], addr[2], addr[3])
        } else {
            return this.addrDic()
        }
    }
    jsonp(url: string, fn: (data: string[][]) => void) {
        ((window) as any).$yubin = (data: any) => fn(data);
        const scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute("charset", "UTF-8");
        scriptTag.setAttribute("src", url);
        document.head.appendChild(scriptTag);
    }
    getAddr(yubin7: string, fn: (addr: Addr) => void) {
        // 上位3桁
        const yubin3 = Number(yubin7.substring(0, 3));
        // 郵便番号上位3桁でキャッシュデータを確認
        if (yubin3 in CACHE && yubin7 in CACHE[yubin3]) {
            return fn(this.selectAddr(CACHE[yubin3][Number(yubin7)]));
        } else {
            this.jsonp(`${this.URL}/${yubin3}.js`, (data: string[][]) => {
                // data[100001] = [13, '千代田区' '千代田']
                CACHE[yubin3] = data;
                return fn(this.selectAddr(data[Number(yubin7)]));
            });
        }
    }
}
// }

// export = YubinBango;
