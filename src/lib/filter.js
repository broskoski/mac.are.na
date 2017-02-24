import { filter } from 'lodash'
import { classifyItem } from './classifier'

const onlySongs = (contents) => {
  return filter(contents, (item) => {
    const type = classifyItem(item)
    return  (type === 'mp3' || type === 'soundcloud' || type === 'youtube')
  })
}

export { onlySongs }