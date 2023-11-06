const express = require('express')
const app = express()


const urls = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" ,
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" ,
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  ]

  const { PassThrough } = require('stream')

  function combineStreams(streams) {
    const stream = new PassThrough()
    _combineStreams(streams, stream).catch((err) => stream.destroy(err))
    return stream
  }
  
  async function _combineStreams(sources, destination) {
    for (const stream of sources) {
      await new Promise((resolve, reject) => {
        stream.pipe(destination, { end: false })
        stream.on('end', resolve)
        stream.on('error', reject)
      })
    }
    destination.emit('end')
  }


app.get('/video.mp4', async (req, res) => {
    const reqs = await Promise.all(urls.map(()=>fetch))
    const streams = reqs.map(req => req.res)
    const combined = combineStreams(streams)
    combined.pipe(res)
})


const port =process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("listening on port : " + port);
});