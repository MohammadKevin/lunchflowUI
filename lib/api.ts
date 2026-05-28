import axios from 'axios'

const baseURL =
  process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL,

  timeout: 15000,
})

api.interceptors.request.use(
  (config) => {
    if (
      typeof window !==
      'undefined'
    ) {
      const token =
        localStorage.getItem(
          'accessToken',
        )

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },

  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (
      error.response?.status ===
        401 &&
      typeof window !==
        'undefined'
    ) {
      localStorage.removeItem(
        'accessToken',
      )

      localStorage.removeItem(
        'user',
      )

      if (
        window.location.pathname !==
        '/login'
      ) {
        window.location.href =
          '/login'
      }
    }

    if (
      error.response?.status ===
        403 &&
      typeof window !==
        'undefined'
    ) {
      window.location.href = '/'
    }

    return Promise.reject(error)
  },
)

export const setAccessToken = (
  token: string,
) => {
  localStorage.setItem(
    'accessToken',
    token,
  )
}

export const removeAccessToken =
  () => {
    localStorage.removeItem(
      'accessToken',
    )

    localStorage.removeItem(
      'user',
    )
  }