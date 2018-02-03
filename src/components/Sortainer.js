import React from 'react'
import classnames from 'classnames'
import { sortKeys } from '../lib/helpers'

const Sortainer = ({ sortState, setSort, stateKey }) => {
   // { orderKey: sortKeys.asc, paramKey: sortKeys.created_at }
   //  setSort = (stateKey, orderKey, paramKey) => {

  const handleSort = (eventKey) => {
    if (sortState.paramKey === eventKey) {
      setSort(stateKey, !sortState.orderKey, sortState.paramKey)
    } else {
      setSort(stateKey, sortState.orderKey, eventKey)
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
