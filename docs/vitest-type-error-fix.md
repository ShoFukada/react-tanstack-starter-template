# Vitest Type Error Fix

## エラー内容

```
vite.config.ts:15:3 - error TS2769: No overload matches this call.
  The last overload gave the following error.
    Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'.

15   test: {
     ~~~~
```

`pnpm build` 実行時に `tsc` がViteの設定ファイルで型エラーを検出しています。

## 原因

1. **誤ったインポート元**: `vite.config.ts` の1行目で `vite` から `defineConfig` をインポートしているが、Vitestの設定（`test` プロパティ）を含める場合は `vitest/config` からインポートする必要がある

2. **型定義の不足**: `tsconfig.json` の `types` 配列に `vitest/globals` が含まれていないため、Vitestのグローバル型が認識されない

## 対策

### 1. vite.config.ts の修正

**変更前:**
```typescript
import { defineConfig } from 'vite'
```

**変更後:**
```typescript
import { defineConfig } from 'vitest/config'
```

`vitest/config` からインポートすることで、Viteの設定に加えてVitestの `test` プロパティの型定義も利用可能になります。

### 2. tsconfig.json の修正

**変更前:**
```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

**変更後:**
```json
{
  "compilerOptions": {
    "types": ["vite/client", "vitest/globals"]
  }
}
```

`vitest/globals` を追加することで、`globals: true` 設定時のグローバル型（`describe`, `it`, `expect` など）が認識されます。

## 補足情報

### なぜこのエラーが起きるのか

- Viteの `defineConfig` 型定義には `test` プロパティが存在しない
- Vitestは独自の設定型を提供しており、`vitest/config` からインポートすることで Vite + Vitest の統合型定義が得られる
- `vitest/config` の `defineConfig` は Vite の設定を継承しつつ、Vitest の `test` プロパティを追加している

### 代替案

Vitestの設定を別ファイル（`vitest.config.ts`）に分離する方法もありますが、多くのプロジェクトでは `vite.config.ts` に統合する方がシンプルです。

## 参考

- [Vitest Configuration](https://vitest.dev/config/)
- [Vitest with Vite](https://vitest.dev/guide/#configuring-vitest)
