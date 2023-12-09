import { createStore } from 'vuex';
import axios from 'axios';

const base = 'http://localhost:3000'

export function createVuexStore() {
    return createStore({
        state() {
            return {
                count: 0
            };
        },
        actions: {
            async fetch(context) {
                try {
                    const response = await axios.get(base+'/api/v1/count');
                    context.commit('set', response.data.count);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            },
            async increment(context) {
                try {
                    await axios.post(base+'/api/v1/count/increment')
                    context.commit('increment')
                } catch (error) {
                    console.error('Error fetching data:', error)
                }
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
