import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";
import { SubjectType } from "../types/components";

const storage = new MMKVLoader().initialize();

export const setSubjects = (subjects: SubjectType[]) => {
    storage.setArray('subjects', subjects);
}

export const getSubjects = (): SubjectType[] => {
    return storage.getArray('subjects') as SubjectType[];
}

export const getDyslexiaMode = (): boolean => {
    return storage.getBool('dyslexiaMode') as boolean;
}

export const setDyslexiaMode = (mode: boolean) => {
    storage.setBool('dyslexiaMode', mode);
}