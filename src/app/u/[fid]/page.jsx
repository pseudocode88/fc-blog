import { render } from "react-dom";

function parseCast(response, fid) {
    console.log("parse casts");
    const casts = response.result.casts;
    let stream = [];
    let temp = '';


    casts.forEach(cast => {
        if (cast.author.fid === fid) {

            console.log(" ");
            console.log(cast.hash, cast.threadHash);

            if (cast.hash === cast.threadHash) {


                const castFound = stream.find(e => e.hash === cast.hash);

                console.log(castFound);

                if (!castFound) {
                    console.log('push', castFound, cast.hash, cast.threadHash);

                    stream.push({
                        hash: cast.hash,
                        content: (temp.length === 0) ? cast.text : (cast.text + temp)
                    })
                    temp = '';
                }
            } else {
                console.log('temp', cast.hash, cast.threadHash);

                temp = cast.text + temp;
            }
        }
    });

    // console.log(streamLength, " casts found");

    return stream;
}

async function getCasts(fid) {
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', 'API-KEY': 'IOOLD-AOQRR-918Q0-6QR88-WXUSW' }
    };

    const res = await fetch('https://build.far.quest/farcaster/v2/casts?fid=' + fid + '&limit=1000', options);
    const json = await res.json();

    return await parseCast(json, fid);
}

export default async function Page({ params }) {
    const casts = await getCasts(params.fid)

    let content = casts.map((entry) => {
        return (
            <>
                <p>{entry.content}</p>
                <hr></hr>
            </>
        )
    })

    // fetch('https://build.far.quest/farcaster/v2/casts?fid=' + fid + '&limit=1000', options)
    //     .then(response => response.json())
    //     .then(parseCast)
    //     .catch(err => console.error(err));

    return (
        <>
            <h1>Blog</h1>
            {content}
        </>
    );

}