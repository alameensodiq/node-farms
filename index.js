const fs = require('fs');

const http= require ('http');

const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules.js/replaceTemplate')
// Blocking ,synchronous way
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);


// const textOut = `This is what we know about the avocado : ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);

// console.log('File written!');

//Non-blocking, asynchronous way
// fs.readFile('./txt/startttt.txt', 'utf-8', (err, data1)=> {
//     if(err) return console.log('ERROR 💥');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2)=> {
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3)=> {
//              console.log(data3)

//              fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8', err=> {
//                    console.log('You file has been written😂');
//              })
//         });
//     });
// });
// console.log('Will read file!');


///Server



const overview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/cards.html`,'utf-8');
const products = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName,{lower:true}))
console.log(slugs)
// console.log(slugify('Fresh Avocado', {lower: true}));

const server = http.createServer((req, res)=> {
    const { query, pathname} =url.parse(req.url, true);

    const pathName = req.url;
// Overview Page
    if( pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type':'text/html'});

        const cardsHtml = dataObj.map (el => replaceTemplate(card, el)).join('');
       const output =overview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
//Product Page        
    } else if(pathname === '/product') {
        res.writeHead(200, {'Content-type':'text/html'});
            
        const product = dataObj[query.id]
        const output = replaceTemplate (products, product);

        // console.log(query);
        res.end(output)
// API         
    } else if(pathname === '/api'){
       
           res.writeHead(200, {'Content-type':'application/json'});
           res.end(data);
        //    console.log(productData)
       
        //  res.end('API')
//NOT FOUND        
    }else {
        res.writeHead(404, {
            'Content-type':'text/html',
            'my-own-header':'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
})

server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening to requests on port 8000');
});