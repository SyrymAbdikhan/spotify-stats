import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateCodeVerifier, generateCodeChallenge, generateState } from '@/utils/pkce'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-follow-read'
].join(' ')

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('spotify_access_token') || null)
  const refreshToken = ref(localStorage.getItem('spotify_refresh_token') || null)
  const expiresAt = ref(Number(localStorage.getItem('spotify_expires_at')) || null)
  const userProfile = ref(JSON.parse(localStorage.getItem('spotify_user') || 'null'))

  const isAuthenticated = computed(() => {
    return !!accessToken.value && Date.now() < (expiresAt.value || 0)
  })

  async function login() {
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    const state = generateState()

    sessionStorage.setItem('pkce_verifier', verifier)
    sessionStorage.setItem('pkce_state', state)

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      code_challenge_method: 'S256',
      code_challenge: challenge,
      state
    })

    window.location.href = `${SPOTIFY_AUTH_URL}?${params}`
  }

  async function handleCallback(code, returnedState) {
    const storedState = sessionStorage.getItem('pkce_state')
    const verifier = sessionStorage.getItem('pkce_verifier')

    if (returnedState !== storedState) throw new Error('State mismatch — possible CSRF')
    if (!verifier) throw new Error('Missing PKCE verifier')

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier
    })

    const res = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    })

    if (!res.ok) throw new Error('Token exchange failed')

    const data = await res.json()
    _storeTokens(data)
    sessionStorage.removeItem('pkce_verifier')
    sessionStorage.removeItem('pkce_state')

    await fetchProfile()
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) throw new Error('No refresh token')

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken.value,
      client_id: CLIENT_ID
    })

    const res = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    })

    if (!res.ok) throw new Error('Token refresh failed')

    const data = await res.json()
    _storeTokens(data)
  }

  async function fetchProfile() {
    const data = await spotifyGet('/me')
    userProfile.value = data
    localStorage.setItem('spotify_user', JSON.stringify(data))
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    expiresAt.value = null
    userProfile.value = null
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_refresh_token')
    localStorage.removeItem('spotify_expires_at')
    localStorage.removeItem('spotify_user')
  }

  function _storeTokens(data) {
    accessToken.value = data.access_token
    if (data.refresh_token) refreshToken.value = data.refresh_token
    expiresAt.value = Date.now() + data.expires_in * 1000

    localStorage.setItem('spotify_access_token', data.access_token)
    if (data.refresh_token) localStorage.setItem('spotify_refresh_token', data.refresh_token)
    localStorage.setItem('spotify_expires_at', String(expiresAt.value))
  }

  async function spotifyGet(path) {
    if (!isAuthenticated.value && refreshToken.value) {
      await refreshAccessToken()
    }

    const res = await fetch(`https://api.spotify.com/v1${path}`, {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })

    if (res.status === 401) {
      await refreshAccessToken()
      return spotifyGet(path)
    }

    if (!res.ok) throw new Error(`Spotify API error: ${res.status}`)
    return res.json()
  }

  return {
    accessToken,
    userProfile,
    isAuthenticated,
    login,
    handleCallback,
    refreshAccessToken,
    logout,
    spotifyGet
  }
})
