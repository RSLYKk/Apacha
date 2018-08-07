//导入模块
const fs = require('fs')
const http=require('http')
const path=require('path')
const mime=require('mime');

//保存网站根目录

let rootPath=path.join(__dirname,'www'); 
// console.log(rootPath);

//创建服务器
let server=http.createServer((request,response)=>{
    // response.setHeader('content-type','text/html;charset=utf-8');
    // response.end('hello world');
    //生成地址  
    let targetPath = path.join(rootPath,request.url);
        console.log(request.url)
        console.log(targetPath);
    //判断路径是否存在
    if(fs.existsSync(targetPath)){
        //读取文件或者文件夹信息，
       fs.stat(targetPath,(err,stat)=>{
           //判断是否时文件
           if(stat.isFile()){
                 response.setHeader('content-type','text/html;charset=utf-8');
               //使用mime设置类型
               response.setHeader('content-type',mime.getType(targetPath).concat(";charset=utf-8"));
               //读取文件
               fs.readFile(targetPath,(err,data)=>{
                   //将文件渲染
                   response.end(data);
               });
           }else{
               if(stat.isDirectory()){
                   //使用mime设置类型
                response.setHeader('content-type',mime.getType(targetPath));
                
                 fs.readdir(targetPath,(err,files)=>{
                     let str ='';
                     for(let i=0;i<files.length;i++){
                         str+=`<li><a href="${request.url}${request.url=='/'?'':'/'}${files[i]}">${files[i]}</a></li>`
                     }

                     response.end(`
                     <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
                     <html>
                     
                     <head>
                        <meta charset="UTF-8">
                         <title>Index of/ </title>
                     </head>
                     
                     <body>
                         <h1>Index of ${request.url}</h1>
                         <ul>
                             ${str}
                         </ul>
                     </body>
                     
                     </html>
                 `);
                 })
               }
           }
       })
       

    }else{
        //不存在的
        response.statusCode=404;
        response.setHeader('content-type','text/html;charset=utf-8');
        
       
        response.end(`
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>你请求的${request.url} 不在服务器上哦,检查一下呗</p>
        </body></html>
        `)

       
    }
})

//开启服务器
server.listen(3000,'127.0.0.1',()=>{
    console.log('开启成功');
});