import { useThree } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'

const Camera = (props) => {

    const ref = useRef()

  return <perspectiveCamera ref={ref} makeDefault {...props} />
}

export default Camera