import DictifiedComms from '../types/DictifiedComms';
import descend from './descend';

const split = (
  dataMap: DictifiedComms,
  retrieve: string,
  reducer: Function,
  reducerInit: boolean = true,
): [DictifiedComms, DictifiedComms] => [
  Object.entries(dataMap).reduce((res, [key, entry]) => {
    if (!descend(entry, retrieve).reduce(reducer, reducerInit)) return { ...res, [key]: entry };
    return res;
  }, {}),
  Object.entries(dataMap).reduce((res, [key, entry]) => {
    if (descend(entry, retrieve).reduce(reducer, reducerInit)) return { ...res, [key]: entry };
    return res;
  }, {}),
];

export default split;
