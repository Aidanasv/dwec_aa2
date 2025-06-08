import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { User } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | undefined>(undefined)
    const token = ref('')
    const isAuthenticated = ref(false)
    const error = ref('')

    async function login(email: string, password: string) {
        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password,
            })

            user.value = response.data.user
            token.value = response.data.token
            isAuthenticated.value = true
            error.value = ''
        } catch (err: any) {
            error.value = 'Credenciales incorrectas'
            isAuthenticated.value = false
        }
    }

    function logout() {
        user.value = undefined
        token.value = ''
        isAuthenticated.value = false
    }

    return { user, token, isAuthenticated, error, login, logout }
})
