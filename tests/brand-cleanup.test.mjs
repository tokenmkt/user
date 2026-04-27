import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('visible brand fallbacks no longer mention Dujiao-Next', () => {
  const files = [
    'src/components/Navbar.vue',
    'src/components/Footer.vue',
    'src/views/NotFound.vue',
    'src/views/auth/Login.vue',
    'src/views/auth/Register.vue',
    'src/views/auth/Forgot.vue',
  ]

  for (const file of files) {
    assert.doesNotMatch(read(file), /Dujiao-Next/)
  }
})

test('localized page copy no longer mentions Dujiao-Next or D&N', () => {
  const i18n = read('src/i18n/index.ts')
  assert.doesNotMatch(i18n, /Dujiao-Next/)
  assert.doesNotMatch(i18n, /\bD&N\b/)
})

test('footer and boot logs no longer advertise dujiao-next project links', () => {
  assert.doesNotMatch(read('src/components/Footer.vue'), /github\.com\/dujiao-next/)
  assert.doesNotMatch(read('src/main.ts'), /dujiao-next/i)
})
