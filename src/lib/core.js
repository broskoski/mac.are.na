function getURL(block) {
  switch (block.class) {
    case 'Attachment':
      return block.attachment.url
    default:
      return block.source.url
  }
}

function updateInObject(originalObject, key, val) {
  return {
    ...originalObject,
    [key]: val,
  }
}

function getStatus(item) {
  switch (item.status) {
    case 'public':
      return 'public'
    case 'closed':
      return 'closed'
    default:
      return 'public'
  }
}

export {
  getURL,
  updateInObject,
}
