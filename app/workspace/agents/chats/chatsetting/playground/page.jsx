"use client"
import React, { Suspense } from 'react'
import Playground from '../../../../../../Components/chatAgent/chatSettings/playground/Playground'

const page = () => {
  return (
    <Suspense>
      <Playground />
    </Suspense>
  )
}

export default page