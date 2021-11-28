import CommissionItem, { CommissionItemWrap } from '../types/CommissionItem';

const getCommissionItemValues = (
  data: CommissionItemWrap,
  key: string,
) : string[] | boolean | CommissionItem[] | CommissionItemWrap => {
  if (key === 'errors') return data.errors;
  if (key === 'discontinued') return data.discontinued;
  if (key === 'data') return data.discontinued;
  return data;
};

export default getCommissionItemValues;
