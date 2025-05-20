import { Collection } from "discord.js";
interface LoadModulesOptions<T> {
    directory: string;
    collection: Collection<string, T>;
    handlerTypeName: string;
    validate: (mod: any) => boolean;
    getKey: (mod: any) => string;
}
declare const loadModules: <T>({ directory, collection, handlerTypeName, validate, getKey, }: LoadModulesOptions<T>) => Promise<void>;
export default loadModules;
