const http=require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceData=(tempData,orgData)=>{
    let temparature = tempData.replace("{%tempval%}",orgData.main.temp);
    temparature = temparature.replace("{%tempmin%}",orgData.main.temp_min);
    temparature = temparature.replace("{%tempmax%}",orgData.main.temp_max);
    temparature = temparature.replace("{%location%}",orgData.name);
    temparature = temparature.replace("{%country%}",orgData.sys.country);
    temparature = temparature.replace("{%tempstatus%}",orgData.weather[0].main);
    return temparature;
};

const server = http.createServer((req,res)=>{
    if(req.url == '/')
    {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Tiruchirappalli&units=metric&appid=78e563a6f34b8c51f0d775254c931f55")
        .on("data",(chunk)=>{
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            const realTimeData = arrData.map((val)=> replaceData(homeFile,val)).join("");
            console.log(realTimeData);
            res.write(realTimeData);
        })
        .on("end",(err)=>{
            if(err)
                return console.log("connection closed due to errors",err);
            res.end();
        });
    }
});

server.listen(8080,"127.0.0.1");
