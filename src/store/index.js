import {
  createStore as _createStore
} from 'vuex';

export function createStore() {
  return _createStore({
    state: {
      taverns: [
        {
          Name: "The Merry Mug",
          Size: 50,
          Quality: "Excellent",
          Bartender: "Gideon Stonebrew"
        }
      ],
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