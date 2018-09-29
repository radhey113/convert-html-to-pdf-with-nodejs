let express  = require('express');
let path = require('path');
var fs = require('fs')
var conversion = require("phantom-html-to-pdf")();
var pdf = require('html-pdf');
const base64 = require('base64-stream');

let app = express();
let port = process.env.port || 3002;
app.use('/', express.static(path.join(__dirname, './')));

/** upload project...  **/ 

app.get('/pdf', (req, res) => {

    let htmlRead = fs.readFile('./index.html', 'utf8', (err, data) => {
        conversion({ html: data }, (err, pdf) => {
            let name = Date.now() + '.pdf';
            let file = fs.createWriteStream(name, {flag: "wx"});
            let base;    
            // base = pdf.stream.pipe(base64.encode()).pipe(file)
            pdf.stream.pipe(file)
                .on('finish', () => {
                    let base64data = fs.readFileSync(name, 'utf8');        
                    base64data = 'data:application/pdf;base64,' + base64data;
                    // res.status(301).jsonp({base: base64data})
                    let pathpdf = 'http://192.168.43.139:3002/' + name;
                    
                    setTimeout(() => {
                      fs.unlinkSync('./' + name);
                    }, 10000);
                    res.jsonp({
                        url: pathpdf,
                        name: name
                    });
                });
        })
    })
});

/** check process env port **/ 
app.listen(port, ()=> {
    console.log(`Project is running... ${port}`);
});