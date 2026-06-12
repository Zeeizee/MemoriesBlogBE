export const parseTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

export const normalizePostBody = (body) => {
  const { id, _id, ...rest } = body;
  return {
    title: rest.title?.trim(),
    message: rest.message?.trim(),
    creator: rest.creator?.trim(),
    category: rest.category?.trim() || undefined,
    selectedFile: rest.selectedFile?.trim() || undefined,
    tags: parseTags(rest.tags),
  };
};

export const validatePostBody = (post) => {
  const errors = [];
  if (!post.title) errors.push("Title is required");
  if (!post.message) errors.push("Content is required");
  if (!post.creator) errors.push("Author name is required");
  return errors;
};
