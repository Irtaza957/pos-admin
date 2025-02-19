import React from 'react'
import Loader from './Loader'

const PageLoader = () => {
    return (
        <div className="flex justify-center items-center absolute top-0 left-0 right-0 bottom-0 bg-bg_base_light opacity-50 !z-50">
            <Loader />
        </div>
    )
}

export default PageLoader