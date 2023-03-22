export const buildSort = ({ orderByParam, allowedKeys, defaultOrderBy }) => {
  if (allowedKeys.includes(orderByParam)) {
    return { [orderByParam]: `asc` }
  }
  const orderByParamIsDesc = orderByParam?.startsWith(`-`)
  if (orderByParamIsDesc) {
    const orderByParamWithoutDesc = orderByParam.substring(1)
    if (allowedKeys.includes(orderByParamWithoutDesc)) {
      return { [orderByParamWithoutDesc]: `desc` }
    }
  }

  return defaultOrderBy
}
