import React from 'react'
import classnames from 'classnames'
import { sortKeys } from '../lib/helpers'

const Sortainer = ({ sortState, setSort, stateKey, currentRoute }) => {
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
  if (currentRoute === '/') {
    return (
      <div>
        <button onClick={() => handleSort(sortKeys.title)}>
          {'Aa'}
        </button>
        <button onClick={() => handleSort(sortKeys.connected_at)}>
          {'Date Added'}
        </button>
        <button onClick={() => handleSort(sortKeys.updated_at)}>
          {'Date Updated'}
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <button onClick={() => handleSort(sortKeys.title)}>
          {'Aa'}
        </button>
        <button onClick={() => handleSort(sortKeys.connected_at)}>
          {'Date Added'}
        </button>
      </div>
    )
  }

}



export default Sortainer
