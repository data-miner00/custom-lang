export type ValueType = "null" | "number";

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
