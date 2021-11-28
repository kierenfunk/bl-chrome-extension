import CommissionGroup from '../types/CommissionGroup';

const communise = (data: any, levels: number): any => {
  if (levels < 1) {
    return [data];
  }

  return Object.values(data).reduce(
    (res: CommissionGroup[], level: any) => [...res, ...communise(level, levels - 1)], [],
  );
};

export default communise;
