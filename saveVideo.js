const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');


const server = http.createServer();
const port =process.env.port || 3000;
server.listen(port,()=>{
    console.log('listening on port ',port);
})

server.on('request',(req,res)=>{
    req.on('data',(data)=>{
        console.log(data.toString());

        req.rawBody+=data;
    })
    if(req.method == 'POST' && req.url === '/downloadVideo'){
        console.log(req.rawBody);
        const file = fs.createWriteStream("file.mp4");
        const request = http.get("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", function(response) {
           response.pipe(file);
        
           // after download completed close 
           file.on("finish", () => {
               file.close();
               console.log("Download Completed");
               res.write("download completed");
               res.end();
           });
        });

    }
})