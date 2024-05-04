import { RuntimeVal } from "./values";

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;

  constructor(parentEnv?: Environment) {
    this.parent = parentEnv;
    this.variables = new Map();
  }

  public declareVariable(varname: string, value: RuntimeVal): RuntimeVal {
    if (this.variables.has(varname)) {
      throw `Cannot redefine variable ${varname}`;
    }

    this.variables.set(varname, value);
    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);
    env.variables.set(varname, value);
    return value;
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname)!;
  }

  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this;
    }

    if (this.parent == undefined) {
      throw `Cannot resolve ${varname}`;
    }

    return this.parent.resolve(varname);
  }
}
