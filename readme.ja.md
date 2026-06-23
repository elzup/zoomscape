# zoomscape

[English](./readme.md) | 日本語

> ある拡大率 / ビューポート幅で、スケール目盛りのどの単位を表示し続けるかを決める。

ルーラー・グリッド・タイムラインを描くとき、たいてい複数の目盛り階層
（分 / 5 分 / 時 / 日 …）を持ちます。ユーザーがズームアウトすると、細かい階層は
密集して読めなくなるのでフェードアウトさせたくなります。`outscape` は各階層について
**「まだ表示できるだけの余裕があるか？」** を答える、依存ゼロの小さな
level-of-detail（詳細度）ヘルパーです。

![outscape ruler at three zoom levels](./assets/outscape.svg)

同じ画面上のルーラーを 3 つのズームレベルで表示したものです。各階層
（時 → 15 分 → 5 分 → 1 分）は、1 目盛りが少なくとも `viewMinWidth` ピクセル分の
幅を持つようになって初めて現れます。そのため、ズームインするほど細かい目盛りが
現れます。`outscape` はまさにこの階層ごとの `visibles` 判定（各ルーラーの右側に表示）を
返します。

## インストール

```
$ npm install zoomscape
```

## 使い方

```ts
import { outscape } from 'zoomscape'

const min = 60_000
const hour = 60 * min
const units = [min, 5 * min, 10 * min, 30 * min, hour]

// 8 時間ぶんを 1000px で描画し、10px より細いものは隠す
outscape(units, 8 * hour, 1000, 10)
// => { visibles: [false, true, true, true, true] }   (分の階層がフェードアウト)

outscape(units, 8 * hour, 500, 10)
// => { visibles: [false, false, true, true, true] }  (分 + 5 分がフェード)

outscape(units, 8 * hour, 10000, 10)
// => { visibles: [true, true, true, true, true] }     (ズームイン、すべて表示)
```

### API

```ts
outscape(
  units: number[],      // 値空間での階層サイズ（例: 時間ルーラーなら ms）
  range: number,        // ビューが表す値の総範囲
  viewWidth: number,    // ビューの幅（ピクセル）
  viewMinWidth: number, // 階層が表示され続けるのに必要な最小ピクセル幅
): { visibles: boolean[] }
```

`visibles[i]` は `units[i] * (viewWidth / range) > viewMinWidth` のとき `true` になります。
結果の配列は入力の `units` と同じ並びです。

## ベンチマーク

Node・Apple Silicon 上での `vitest bench`。この関数は単一の `map` なので、
実質的にコストはありません。

| 入力        |        ops/sec |       相対 |
| ----------- | -------------: | ---------: |
| 5 units     | ~10,700,000/s  |         1x |
| 1000 units  |    ~547,000/s  | ~19.6x 遅い |

自分で実行する:

```
$ pnpm bench
```

## ライセンス

MIT © [anozon](https://anozon.me)
