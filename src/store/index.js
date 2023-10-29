import {
  createStore as _createStore
} from 'vuex';

export function createStore() {
  return _createStore({
    state: {
      taverns: [],
      magicShops: []
    },
    mutations: {
      ADD_TAVERN(state, tavern) {
        state.taverns.push(tavern);
      }
    },
    actions: {},
    modules: {},
    strict: true
  });
}