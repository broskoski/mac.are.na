import React from 'react'
import classnames from 'classnames'
import { sortKeys } from '../lib/helpers'

const Sortainer = ({ sortState, setSort, stateKey }) => {
   // { orderKey: sortKeys.asc, paramKey: sortKeys.created_at }
   //  setSort = (stateKey, orderKey, paramKey) => {
   // const { stateKey, orderKey, paramKey, } = sortObj

  const handleSort = (newParamKey) => {
    console.log(newParamKey, sortState.paramKey)
    if (sortState.paramKey === newParamKey) {
      console.log('eval true', !sortState.orderKey, sortState.paramKey)
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

  return (
    <div>
      <button onClick={() => handleSort(sortKeys.title)}>{'Aa'}</button>
      <button onClick={() => handleSort(sortKeys.created_at)}>{'Date Created'}</button>
      <button onClick={() => handleSort(sortKeys.updated_at)}>{'Date Updated'}</button>
    </div>
  )
}



export default Sortainer
