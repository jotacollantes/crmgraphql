import { usePedido } from '@/hooks/usePedido'
import React from 'react'

export const Total = () => {
    
    const {total}=usePedido()
  return (
    <div className='flex items-center mt-5 justify-between bg-white p-3 border-solid border-2 border-gray-400'>
        <h2 className='text-gray-800 text-lg'>Total a pagar:</h2>
    <p className='text-gray-800 mt-0'>$ {total}</p>
    </div>
  )
}
