import React from 'react'
import classnames from 'classnames'
import { sortKeys } from '../lib/helpers'
import sortArrow from '../assets/sortArrow.svg'

const Sortainer = ({
  playlistChannelSortObj,
  playlistSortObj,
  setSort,
  currentRoute,
  searchQuery,
  setQueryInState,
}) => {

  const sortState = currentRoute === '/'
    ? playlistChannelSortObj
    : playlistSortObj

  const stateKey = currentRoute === '/'
    ? 'playlistChannel'
    : 'playlist'

  const handleSort = (newParamKey) => {
    if (sortState.paramKey === newParamKey) {
      setSort({
        stateKey,
        orderKey: !sortState.orderKey,
        paramKey: sortState.paramKey,
      })
    } else {
      setSort({
        stateKey,
        orderKey: sortState.orderKey,
        paramKey: newParamKey,
      })
    }
  }

  const alphaSortClasses = classnames({
    selected: sortState.paramKey === sortKeys.title,
    unselected: sortState.paramKey !== sortKeys.title,
  })

  const connectedSortClasses = classnames({
    selected: sortState.paramKey === sortKeys.connected_at,
    unselected: sortState.paramKey !== sortKeys.connected_at,
  })

  const updatedSortClasses = classnames({
    selected: sortState.paramKey === sortKeys.updated_at,
    unselected: sortState.paramKey !== sortKeys.updated_at,
  })

  const orderSortClasses = classnames({
    asc: !sortState.orderKey,
    desc: sortState.orderKey,
  })

  if (currentRoute === '/') {
    return (
      <div id={'Sortainer'}>
        <div className={'left'}>
          <input
            className={'search'}
            value={searchQuery}
            type={'text'}
            placeholder={'Search Channels'}
            onChange={(e) => setQueryInState(e)} />
        </div>
        <div className={'right'}>
          <button
            className={alphaSortClasses}
            onClick={() => handleSort(sortKeys.title)}>
            {'Title'}
            <img className={orderSortClasses} src={sortArrow} />
          </button>
          <button
            className={connectedSortClasses}
            onClick={() => handleSort(sortKeys.connected_at)}>
            {'Connected'}
            <img className={orderSortClasses} src={sortArrow} />
          </button>
          <button
            className={updatedSortClasses}
            onClick={() => handleSort(sortKeys.updated_at)}>
            {'Updated'}
            <img className={orderSortClasses} src={sortArrow} />
          </button>
        </div>
      </div>
    )
  } else {
    return (
      <div id={'Sortainer'}>
        <div className={'left'}>
          <div className={'search'} />
        </div>
        <div className={'right'}>
          <button
            className={alphaSortClasses}
            onClick={() => handleSort(sortKeys.title)}>
            {'Title'}
            <img className={orderSortClasses} src={sortArrow} />
          </button>
          <button
            className={connectedSortClasses}
            onClick={() => handleSort(sortKeys.connected_at)}>
            {'Connected'}
            <img className={orderSortClasses} src={sortArrow} />
          </button>
        </div>
      </div>
    )
  }


}


export default Sortainer
