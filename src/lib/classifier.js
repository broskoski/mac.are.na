const classifyItem = (item) => {
  const isAttachment = item.class === 'Attachment'
  const isMedia = item.class === "Media"

  if (isAttachment && item.attachment.extension === "mp3") return "mp3" 
  if (isMedia && item.source.url.indexOf('soundcloud') > 0) return "soundcloud"
  if (isMedia && item.source.url.indexOf('youtube') > 0) return "youtube"

  return 'notSupported'
}

export { classifyItem }