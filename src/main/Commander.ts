import { commands } from 'Utils';

export default class Commander {
    private constructor() {}

    public static exec(id: string, ...args: any[]) {
        commands().get(id)(args);
    }
}
