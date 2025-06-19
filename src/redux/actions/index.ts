import {actionType} from '../types';

export const EntityDataAction = (payload: any) => {
  return {
    type: actionType.ENTITYDATA,
    payload,
  };
};
