import React, {useReducer} from 'react';
import Context from './index';
import actions from './action';
import {initialState} from './initialState';
import reducer from './reducer';
import {propsType, contextValueType} from './types';

const ContextProvider = (props: propsType) => {
  const {children} = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: contextValueType = {
    userName: state.userName,
    setUserName: (val: string) => {
      dispatch({type: actions.USER_NAME, data: val});
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ContextProvider;
