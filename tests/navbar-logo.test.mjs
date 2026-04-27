import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const navbarSource = readFileSync(new URL('../src/components/Navbar.vue', import.meta.url), 'utf8')

test('navbar uses the tokenmkt logo asset', () => {
  assert.match(navbarSource, /src=["']\/tokenmkt-logo\.svg["']/)
  assert.match(navbarSource, /alt=["'][^"']*tokenmkt[^"']*["']/i)
})

test('tokenmkt logo asset exists in public assets', () => {
  assert.equal(existsSync(new URL('../public/tokenmkt-logo.svg', import.meta.url)), true)
})
