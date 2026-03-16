<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 theme-panel-soft border-b theme-border backdrop-blur-md transition-all"
    :class="scrolled ? 'py-2 shadow-lg' : 'py-4'"
    :style="{ transitionDuration: 'var(--ui-duration-normal)' }">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="theme-wordmark group relative" :title="brandSiteName">
        <span class="theme-wordmark-text">{{ brandSiteName }}</span>
      </router-link>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-1">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path"
          class="theme-nav-link text-sm relative group overflow-hidden flex items-center gap-1.5"
          active-class="theme-nav-link-active">
          <svg class="w-4 h-4 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="item.icon" />
          </svg>
          <span class="relative z-10">{{ t(item.label) }}</span>
        </router-link>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-2 md:space-x-4">
        <!-- Cart (desktop only, mobile has bottom nav) -->
        <router-link to="/cart"
          class="hidden md:flex theme-nav-link relative gap-2 px-3 min-w-[44px] min-h-[44px] items-center justify-center">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 2.6a1 1 0 00.9 1.4H19M7 13l.4 2M10 21a1 1 0 100-2 1 1 0 000 2zm8 1a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          <span class="text-xs font-medium">{{ t('navbar.cart') }}</span>
          <span v-if="cartCount > 0"
            class="theme-nav-badge absolute -top-1 -right-1"
            :class="{ 'theme-bounce-in': cartBounce }">
            {{ cartCount }}
          </span>
        </router-link>

        <router-link v-if="!userAuthStore.isAuthenticated" to="/guest/orders"
          class="hidden md:inline-flex theme-nav-link items-center gap-1.5">
          <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          {{ t('navbar.guestOrders') }}
        </router-link>
        <router-link v-if="!userAuthStore.isAuthenticated" to="/auth/login"
          class="hidden md:inline-flex theme-nav-link items-center gap-1.5">
          <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          {{ t('navbar.login') }}
        </router-link>
        <router-link v-if="userAuthStore.isAuthenticated" to="/me"
          class="hidden md:inline-flex theme-nav-link items-center gap-1.5">
          <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ t('navbar.personalCenter') }}
        </router-link>
        <button v-if="userAuthStore.isAuthenticated" @click="userAuthStore.logout()"
          class="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-500/20 text-xs font-medium">
          <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {{ t('navbar.logout') }}
        </button>
        <!-- Theme Switcher -->
        <button @click="toggleTheme"
          class="theme-nav-link p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <SunIcon v-if="theme === 'dark'" class="w-4 h-4" />
          <MoonIcon v-else class="w-4 h-4" />
        </button>

        <!-- Language Switcher (Desktop) -->
        <div class="relative group/lang lang-switcher hidden md:block">
          <button @click="toggleLangMenu"
            class="theme-nav-link space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span class="text-xs font-medium uppercase tracking-wider">{{ currentLocale }}</span>
          </button>

          <!-- Dropdown -->
          <div v-if="showLangMenu"
            class="absolute right-0 mt-2 w-40 theme-panel-strong border rounded-xl shadow-2xl py-2 z-50 overflow-hidden backdrop-blur-xl">
            <div class="px-2 pb-2 mb-2 border-b border-gray-100 dark:border-white/5">
              <span class="text-xs theme-text-muted font-mono px-2">{{ t('navbar.selectLanguage') }}</span>
            </div>
            <button v-for="lang in languages" :key="lang.code" @click="changeLanguage(lang.code)"
              class="w-full text-left px-4 py-2.5 text-sm theme-text-secondary hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group/item"
              :class="{ 'theme-text-accent': appStore.locale === lang.code }">
              {{ lang.name }}
              <span v-if="appStore.locale === lang.code"
                class="w-1.5 h-1.5 rounded-full theme-accent-stick"></span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button (more menu, not main nav) -->
        <button @click="toggleMobileMenu"
          class="md:hidden theme-nav-link p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="19" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

  </nav>

  <!-- Teleport drawer outside nav to avoid backdrop-filter containing block bug -->
  <Teleport to="body">
    <!-- Mobile Drawer Overlay -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="showMobileMenu" class="md:hidden fixed inset-0 z-[60] bg-black/50" @click="showMobileMenu = false" style="overscroll-behavior: none;"></div>
    </Transition>

    <!-- Mobile Drawer (only items NOT in bottom nav) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full">
      <div v-if="showMobileMenu"
        class="md:hidden fixed right-0 top-0 bottom-0 z-[70] w-72 max-w-[80vw] theme-panel-strong backdrop-blur-xl border-l theme-border overflow-y-auto"
        style="overscroll-behavior: none;">
        <div class="p-5 space-y-1">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-semibold theme-text-muted uppercase tracking-wider">{{ t('navbar.more') }}</span>
            <button @click="showMobileMenu = false" class="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg theme-btn-neutral">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Navigation items not in bottom nav: Blog, Notice, About -->
          <router-link v-for="item in mobileDrawerItems" :key="item.path" :to="item.path" @click="showMobileMenu = false"
            class="block w-full text-left px-4 py-3 rounded-xl theme-nav-link text-sm min-h-[44px] flex items-center gap-3"
            active-class="theme-nav-link-active">
            <svg class="w-5 h-5 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="item.icon" />
            </svg>
            {{ t(item.label) }}
          </router-link>

          <!-- Guest orders (not in bottom nav) -->
          <router-link v-if="!userAuthStore.isAuthenticated" to="/guest/orders" @click="showMobileMenu = false"
            class="block w-full text-left px-4 py-3 rounded-xl theme-nav-link text-sm min-h-[44px] flex items-center gap-3"
            active-class="theme-nav-link-active">
            <svg class="w-5 h-5 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            {{ t('navbar.guestOrders') }}
          </router-link>

          <!-- Logout (login/me already in bottom nav) -->
          <button v-if="userAuthStore.isAuthenticated" @click="userAuthStore.logout(); showMobileMenu = false"
            class="w-full text-left px-4 py-3 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium min-h-[44px] flex items-center gap-3">
            <svg class="w-5 h-5 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {{ t('navbar.logout') }}
          </button>

          <!-- Language Switcher -->
          <div class="mt-4 pt-4 border-t theme-border">
            <span class="text-xs theme-text-muted font-semibold uppercase tracking-wider px-4">{{ t('navbar.selectLanguage') }}</span>
            <div class="mt-2 space-y-1">
              <button v-for="lang in languages" :key="lang.code" @click="changeLanguage(lang.code)"
                class="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors min-h-[44px] flex items-center justify-between"
                :class="appStore.locale === lang.code
                  ? 'theme-text-accent font-semibold'
                  : 'theme-text-secondary hover:theme-text-primary'">
                {{ lang.name }}
                <span v-if="appStore.locale === lang.code"
                  class="w-1.5 h-1.5 rounded-full theme-accent-stick"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'
import { useCartStore } from '../stores/cart'
import { useUserAuthStore } from '../stores/userAuth'
import { useTheme } from '../utils/theme'
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const appStore = useAppStore()
const cartStore = useCartStore()
const userAuthStore = useUserAuthStore()
const { theme, toggleTheme } = useTheme()

const showMobileMenu = ref(false)
const showLangMenu = ref(false)
const scrolled = ref(false)
const cartBounce = ref(false)

const menuItems = [
  { path: '/', label: 'nav.home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { path: '/products', label: 'nav.products', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { path: '/blog', label: 'nav.blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2' },
  { path: '/notice', label: 'nav.notice', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { path: '/about', label: 'nav.about', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

// Mobile drawer only shows items NOT in the bottom nav (Home, Products, Cart, Me are in bottom nav)
const mobileDrawerItems = [
  { path: '/blog', label: 'nav.blog', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2' },
  { path: '/notice', label: 'nav.notice', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { path: '/about', label: 'nav.about', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

const languages = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'en-US', name: 'English' },
]

const currentLocale = computed(() => {
  const lang = languages.find(l => l.code === appStore.locale)
  if (!lang) return 'CN'
  return lang.code === 'en-US' ? 'EN' : (lang.code === 'zh-CN' ? '简' : '繁')
})

const cartCount = computed(() => cartStore.totalItems)

const brandSiteName = computed(() => {
  const text = String(appStore.config?.brand?.site_name || '').trim()
  return text !== '' ? text : 'Dujiao-Next'
})

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  if (showMobileMenu.value) showLangMenu.value = false
}

const toggleLangMenu = () => {
  showLangMenu.value = !showLangMenu.value
}

const changeLanguage = (langCode: string) => {
  appStore.setLocale(langCode)
  locale.value = langCode
  showLangMenu.value = false
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

// Click outside to close menus
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.lang-switcher')) {
    showLangMenu.value = false
  }
}

// Cart badge bounce animation on count change
watch(cartCount, (newVal, oldVal) => {
  if (newVal > oldVal) {
    cartBounce.value = true
    setTimeout(() => { cartBounce.value = false }, 400)
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>
