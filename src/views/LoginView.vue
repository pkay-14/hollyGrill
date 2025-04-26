<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Admin Login</h2>
      <form @submit.prevent="handleLogin">
        <label for="username">
          Email:
          <input
            id="username"
            type="email"
            v-model="username"
            required
            placeholder="admin@example"
          />
        </label>

        <label for="password" class="password-label">
          Password:
          <div class="password-input">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              placeholder="Your password"
            />
            <span @click="togglePassword">
              {{ showPassword ? '🙈' : '👁️' }}
            </span>
          </div>
        </label>

        <button type="submit">Login</button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../../api/api-calls';

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const error = ref('');
const router = useRouter();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  error.value = '';

  try {
    const response = await login({ username: username.value, password: password.value });

    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      router.push('/admin'); 
    } else {
      error.value = response.data.error ? response.data.error : 'an error occured please contact support'
    }
  } catch (err) {
    error.value = err.response.data.error ? err.response.data.error: 'an error occured please contact suport'
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #f2f2f2;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  position: relative;
  top: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.login-box {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px; /* Adjust width for slightly more horizontal stretch */
  text-align: center;
  display: flex;
  flex-direction: column;
}

h2 {
  margin-bottom: 1.2rem;
  color: #333;
  font-size: 1.6rem; /* Slightly smaller font */
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  color: #444;
  margin-bottom: 0.8rem;
  text-align: left;
  font-size: 1rem;
  width: 100%;
}

input {
  padding: 0.75rem;
  margin-top: 0.3rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
  width: 100%;
}

input:focus {
  border-color: #4caf50;
}

.password-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.password-input span {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2rem;
  color: #4caf50;
}

button {
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: #4caf50;
  color: white;
  font-size: 1.1rem; /* Slightly larger font for the button */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #45a049;
}

.error-msg {
  color: #e74c3c;
  margin-top: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 768px) {
  .login-box {
    padding: 1.5rem;
    width: 100%;
    max-width: 380px;
  }

  h2 {
    font-size: 1.5rem;
  }

  input {
    font-size: 0.95rem; /* Slightly smaller font size on mobile */
  }

  button {
    font-size: 1rem; /* Button font size on mobile */
  }
}

@media (max-width: 480px) {
  body {
    padding: 0 10px;
  }

  .login-box {
    padding: 1.2rem;
    width: 100%;
    max-width: 350px;
  }

  h2 {
    font-size: 1.3rem;
  }

  input {
    font-size: 0.9rem;
  }

  button {
    font-size: 0.95rem;
  }
}
</style>
