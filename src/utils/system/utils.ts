import type { QuietDictionary } from '@/services/system/EntityType';

export function buildDictionaryCascaderValue(
  dictionaries: QuietDictionary[],
  databaseValue: string,
): string[] {
  let datum: string[] = [];
  dictionaries.every((dictionary) => {
    const dictionaryValue = `${dictionary.type}.${dictionary.key}`;
    if (dictionary.children) {
      datum = datum.concat(buildDictionaryCascaderValue(dictionary.children, databaseValue));
      if (datum.length > 0) {
        datum.unshift(dictionaryValue);
        return false;
      }
    }
    if (databaseValue === dictionaryValue) {
      datum.push(dictionaryValue);
    }
    return true;
  });
  return datum;
}
