function makeHash() {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

function onlySongs (contents) {
  return contents.filter(item => {
    const type = classifyItem(item)
    return type === 'mp3' || type === 'soundcloud' || type === 'youtube'
  })
}

function getYoutubeId (url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&\?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : false
}

function classifyItem(item) {
  const isAttachment = item.class === 'Attachment'
  const isMedia = item.class === "Media"

  if (isAttachment && item.attachment.extension === "mp3") return "mp3"
  if (isMedia && item.source.url.indexOf('soundcloud') > 0) return "soundcloud"
  if (isMedia && item.source.url.indexOf('youtube') > 0) return "youtube"

  return 'notSupported'
}

export {
  onlySongs,
  getYoutubeId,
  classifyItem,
  makeHash,
}
