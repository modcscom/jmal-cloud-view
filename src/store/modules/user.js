import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, getConsumerId, setConsumerId, removeToken, removeConsumerId , setRememberName, removeRememberName } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    showName: '',
    avatar: '',
    userId: getConsumerId(),
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_SHOW_NAME: (state, showName) => {
    state.showName = showName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, rememberMe } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        commit('SET_USERID', data.userId)
        setConsumerId(data.userId)
        if(rememberMe){
          setRememberName(username)
        } else {
          removeRememberName()
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({
        id: state.userId,
        token: state.token
      }).then(response => {
        const { data } = response
        if (!data) {
          // reject('Verification failed, please Login again.')
        }

        const { id, username, showName, avatar } = data

        commit('SET_NAME', username)
        commit('SET_SHOW_NAME', showName)
        commit('SET_AVATAR', avatar)
        commit('SET_USERID', id)
        sessionStorage.setItem('store', JSON.stringify(state))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removeConsumerId()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeConsumerId()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

