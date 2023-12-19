import { createStore } from 'vuex';
import axios from 'axios';

const base = 'http://localhost:3000'

export const store = createVuexStore()

function createVuexStore() {
    return createStore({
        state() {
            return {
                count: 0
            };
        },
        actions: {
            async fetch(context) {
                const response = await axios.get(base + '/api/v1/count')
                context.commit('set', response.data.count);
            },
            async increment(context) {
                await axios.post(base+'/api/v1/count/increment')
                context.commit('increment')
            }
        },
        mutations: {
            increment(state) {
                state.count++
            },
            set(state, count) {
                state.count = count
            }
        }
    });
}
