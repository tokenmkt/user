import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

test('site icon uses the tokenmkt png asset', () => {
  assert.match(indexHtml, /<link\s+rel=["']icon["'][^>]*type=["']image\/png["'][^>]*href=["']\/tokenmkt_icon\.png["'][^>]*>/)
})

test('tokenmkt icon asset exists in public assets', () => {
  assert.equal(existsSync(new URL('../public/tokenmkt_icon.png', import.meta.url)), true)
})
