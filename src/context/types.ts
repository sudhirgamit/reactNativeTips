export type actionType = {
  type: string;
  data: any;
};

export type propsType = {
  children: React.ReactNode;
};

export type contextValueType = {
  userName: string;
  setUserName: (val: string) => void;
};
