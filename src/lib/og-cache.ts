import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type { CollectionEntry } from 'astro:content'

const CACHE_DIR = path.join(process.cwd(), 'node_modules', '.cache', 'og-images')
const MANIFEST_PATH = path.join(CACHE_DIR, 'manifest.json')

type Manifest = Record<string, string>

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
  }
}

function readManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {}
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'))
}

function writeManifest(manifest: Manifest): void {
  ensureCacheDir()
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
}

function safeFileName(id: string): string {
  return id.replace(/[/\\:]/g, '_')
}

/**
 * OG画像に影響するデータからハッシュを生成する
 */
export function computeOgHash(post: CollectionEntry<'blog'>): string {
  const { title, description, date, tags } = post.data
  const payload = JSON.stringify({
    title,
    description,
    date: date.toISOString(),
    tags: tags ?? []
  })
  return createHash('sha256').update(payload).digest('hex').slice(0, 16)
}

/**
 * キャッシュからOG画像を取得する。ハッシュが一致すればUint8Arrayを返す。
 */
export function getCachedOgImage(postId: string, hash: string): Uint8Array | null {
  const manifest = readManifest()
  if (manifest[postId] !== hash) {
    return null
  }

  const filePath = path.join(CACHE_DIR, `${safeFileName(postId)}.png`)
  if (!fs.existsSync(filePath)) {
    return null
  }

  return new Uint8Array(fs.readFileSync(filePath))
}

/**
 * 生成したOG画像をキャッシュに保存する
 */
export function saveCachedOgImage(postId: string, hash: string, pngBuffer: Uint8Array): void {
  ensureCacheDir()

  const filePath = path.join(CACHE_DIR, `${safeFileName(postId)}.png`)
  fs.writeFileSync(filePath, pngBuffer)

  const manifest = readManifest()
  manifest[postId] = hash
  writeManifest(manifest)
}
