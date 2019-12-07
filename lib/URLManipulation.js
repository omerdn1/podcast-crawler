const stripQueryStringFromURL = url => {
  return url.split('?')[0];
};

export { stripQueryStringFromURL };
