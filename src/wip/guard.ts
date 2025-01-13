export const guard = <TFunction extends () => any>(
  func: TFunction,
  shouldGuard?: (err: any) => boolean,
): ReturnType<TFunction> extends Promise<any> ? Promise<Awaited<ReturnType<TFunction>> | undefined> : ReturnType<TFunction> | undefined => {
  const _guard = (err: any) => {
    if (shouldGuard && !shouldGuard(err)) {
      throw err;
    }
    return undefined as any;
  };
  try {
    const result = func();
    return result instanceof Promise ? result.catch(_guard) : result;
  } catch (err) {
    return _guard(err);
  }
};
