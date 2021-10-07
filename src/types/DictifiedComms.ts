import { CommissionItemWrap } from './CommissionItem';

type DictifiedComms = {
  [key: string] : DictifiedComms | CommissionItemWrap
};

export default DictifiedComms;
