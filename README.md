# YubinBango-Core-Strict

YubinBango-Coreに7桁の郵便番号を与えると住所をオブジェクトで取得します。

yubinbango/yubinbango-coreからのフォークです。
moduleがエクスポートされておらず、またstrictモードやESNEXTでビルドするとエラーになるため元のソースコードから少し変更しています。
Vue等から利用したい時に有効です。

## Install

```
npm install yubinbango-core-strict
```

## Usage

```
import { YubinBangoCore } from 'yubinbango-core-strict';

new YubinBangoCore(form.postalcd, function (addr) {
    // region_id=県コード, region=都道府県, locality=市区町村, street=町域
    console.log(addr)
    form.pref_id = addr.region_id
    form.address1 = addr.region + addr.locality + addr.street
})
```

## MEMO,TODO

gulpのバージョンが古くテストが動きません。
