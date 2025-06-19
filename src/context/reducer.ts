import actions from './action';
import {actionType, contextValueType} from './types';

const reducer = (state: any, action: actionType): contextValueType => {
  switch (action.type) {
    case actions.USER_NAME:
      return {
        ...state,
        userName: action.data,
      };

    default:
      return state;
  }
};

export default reducer;
