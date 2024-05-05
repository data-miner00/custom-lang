export type ValueType = "null" | "number" | "bool";

export interface RuntimeVal {
  type: ValueType;
}

export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

export function MK_NUL(): NullVal {
  return <NullVal>{ type: "null", value: null };
}

export interface BoolVal extends RuntimeVal {
  type: "bool";
  value: boolean;
}

export function MK_BUL(bool = true): BoolVal {
  return <BoolVal>{ type: "bool", value: bool };
}

export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

export function MK_NUM(number = 0): NumberVal {
  return <NumberVal>{
    value: number,
    type: "number",
  };
}
