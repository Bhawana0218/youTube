// 'use client'
// import React, { useRef } from 'react';

// const Videoplayer = ({ video }: any) => {
//     const videoRef = useRef<HTMLVideoElement>(null);

//     return (
//         <div className="w-full max-w-4xl mx-auto">
//             <video 
//                 ref={videoRef}
//                 className="w-full h-auto max-h-[500px] rounded-lg bg-black"
//                 controls
//                 poster={`/placeholder.svg?height-480width-854`}
//             >
//                 <source 
//                 src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${video?.filepath}`}
//                 type="video/mp4"
//                 />
//             </video>
//         </div>
//     );
// }

// export default Videoplayer;



'use client'

import React, { useRef } from 'react';

const Videoplayer = ({ video }: any) => {

    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div className="w-full max-w-4xl mx-auto">

            <video
                ref={videoRef}
                className="w-full h-auto max-h-[500px] rounded-lg bg-black"
                controls
            >
                <source
                    // src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${video?.filepath}`}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${video?.filepath.replace(/\\/g, "/")}`}
                    type="video/mp4"
                />
            </video>

        </div>
    );
}

export default Videoplayer;