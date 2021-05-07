import { GET_CATALOGUE } from "../actions/catalogueAction";


const initialState = {
    catalogue: []
}

export default function reducer(state= initialState, action) {
    switch(action.type) {
        case GET_CATALOGUE:
            return {
                ...state,
                catalogue: action.payload
            }
            default:
                return state; 
    }
}