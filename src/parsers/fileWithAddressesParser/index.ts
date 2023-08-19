import fs from 'fs';

export default function fileWithAddressesParser(path: string) {
  return fs
    .readFileSync(path, 'utf8')
    .split(',\n')
    .filter((el) => el !== '');
}
