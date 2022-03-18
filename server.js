const express = require('express')
const expressFileUpload = require('express-fileupload');
const fs = require('fs').promises
const nunjucks=require('nunjucks')
const app = express()


// configuramos la subida de archivos
app.use(expressFileUpload({
    limits: { fileSize:5242880
},
    abortOnLimit: true,
    responseOnLimit: 'El peso del archivo supera el máximo'
}));

app.use(express.static("static"))

nunjucks.configure('templates', {
    express: app,
    autoescape: true,
    watch: true
})

app.get('/', async (req, res) => {
    res.render("formulario.html")
})

app.post('/imagen', async (req, res) => {
    const img = req.files.target_file;
    const posicion = req.body.posicion;
    console.log('datos del formulario', req.body);
    
    await img.mv(`static/imgs/imagen-${posicion}.jpg`);
    res.redirect('/collage')
})
    
app.get(`/collage`, async (req, res) => {
    res.render(`collage.html`)
})
    
app.get(`/deleteImg/:nombre`, async (req, res) => {
    const nombre = req.params.nombre; 
    console.log({borrar: nombre});
    await fs.unlink(`static/imgs/${nombre}`);
    res.redirect('/collage')
})


app.listen(3000,()=>console.log("servidor corriendo en el puerto 3000"))

/*app.get("/", (req, res) => {
res.sendFile(__dirname + "/index.html");
});
// Paso 4
app.delete("/imagen/:nombre", (req, res) => {
const { nombre } = req.params;
fs.unlink(`${__dirname}/public/imagenes/${nombre}.jpg`, (err) => {
res.send(`Imagen ${nombre} fue eliminada con éxito`);
});
});*/