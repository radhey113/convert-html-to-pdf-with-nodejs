let express  = require('express');
let path = require('path');
var fs = require('fs')
var conversion = require("phantom-html-to-pdf")();
var pdf = require('html-pdf');
const base64 = require('base64-stream');

let app = express();
app.use('/', express.static(path.join(__dirname, './')));

/** upload project...  **/ 

app.get('/checkpdf', (req, res) => {
    console.log('sdfasfafa: ', req.params);
    let htmlRead = fs.readFile('./index.html', 'utf8', (err, data) => {
        conversion({ html: data }, (err, pdf) => {
            let name = Date.now() + 'google.pdf';
            let file = fs.createWriteStream(name, {flag: "wx"});
            let base;    
            // base = pdf.stream.pipe(file)
            // base = pdf.stream.pipe(base64.encode()).pipe(file)
             base = pdf.stream.pipe(file)
                .on('finish', () => {
                    let base64data = fs.readFileSync(name, 'utf8');        
                    base64data = 'data:application/pdf;base64,' + base64data;
                    // res.status(301).jsonp({base: base64data})
                    let pathpdf = 'http://localhost:3002/' + name;
                    res.redirect(pathpdf);
                    setTimeout(() => {
                      fs.unlinkSync('./' + name);
                    }, 10000);
                });
        })
    })
});

/** check process env port **/ 
app.listen(process.env.PORT || 3002, ()=> {
    console.log(`Project is running... ${process.env.PORT || 3001}`);
});