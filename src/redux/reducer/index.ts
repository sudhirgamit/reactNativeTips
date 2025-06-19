import {AnyAction} from 'redux';
import {actionType} from '../types';

const initailState = {
  entityData: [],
};

const reducer = (state = initailState, action: AnyAction) => {
  switch (action.type) {
    case actionType.ENTITYDATA:
      return {
        ...state,
        entityData: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
