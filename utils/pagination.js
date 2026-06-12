export const parsePagination = (
  query,
  { defaultLimit = 10, maxLimit = 50 } = {}
) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(query.limit, 10) || defaultLimit)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPageMeta = ({ page, limit, total }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  return {
    page,
    limit,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
};

export const parseCursorLimit = (query, { defaultLimit = 12, maxLimit = 50 } = {}) => {
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(query.limit, 10) || defaultLimit)
  );
  const cursor = query.cursor?.trim() || undefined;
  return { limit, cursor };
};
