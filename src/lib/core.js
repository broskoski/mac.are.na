function getURL(block) {
  if (block.state === 'available') {
    switch (block.class) {
      case 'Attachment':
        return block.attachment.url
      case 'Text':
        return false
      default:
        return block.source.url
    }
  }
  return false
}

function updateInObject(originalObject, key, val) {
  return {
    ...originalObject,
    [key]: val
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

function fillTitle(title) {
  if (title === null || title === '') {
    return 'Untitled on Are.na'
  }
  return title
}

function incrementInList(list, currentIndex) {
  const listLength = list.length
  if (currentIndex + 1 < listLength) {
    return list[currentIndex + 1]
  }
  return false
}

function decrementInList(list, currentIndex) {
  if (currentIndex > 0) {
    return list[currentIndex - 1]
  }
  return false
}

export {
  getURL,
  updateInObject,
  fillTitle,
  incrementInList,
  decrementInList,
  getStatus
}
