const chai = require('chai');
const chaiHttp = require('chai-http');
const expect  = require('chai').expect;
const url = 'http://localhost:3000';

chai.use(chaiHttp);



describe('Testeando el login y su respuesta',()=>{
    it('Probando miperfil con una cuenta que existe', function(done){
        chai.request(url)
        .post('/clientes/miperfil')
        .send({USERNAME: 'ANGEL_SEQ_CRUZ',
        PASSWORD_USUARIO: 'secreto'})
        .end(function(err,res){
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.be.a('object')
            expect(res).to.have.status(200)
            done()
        })
    })

    it('Probando miperfil con una cuenta falsa (debe devolver un error)', function(done) {
        chai.request(url)
            .post('/clientes/miperfil')
            .send({
                USERNAME: 'ALGOQUENOEXISTE',
                PASSWORD_USUARIO: 'CONTEQU'
            })
        .end(function (err,res) {
            expect(res.body).to.be.a('string');
            expect(res.body).to.be.equal('No existe el usuario');
            expect(res).to.have.status(400)
            done()
        })
    })

    it('Probando miperfil con una cuenta que existe pero una contraseña equivocada (debe devolver un error)',function(done) {
        chai.request(url)
            .post('/clientes/miperfil')
            .send({
                USERNAME: 'ANGEL_SEQ_CRUZ',
                PASSWORD_USUARIO: 'CONTEQUIVOCADA'
            })
        .end(function (err,res) {   
            expect(res.body).to.be.a('string');
            expect(res.body).to.be.equal('Contraseña incorrecta');
            expect(res).to.have.status(400);
            done();
        })
    })
} )


describe('Testeando los endpoints para pedidos', () => {
    it('Probando la creacion de un nuevo pedido', function(done) {
        chai.request(url)
            .post('/pedidos/nuevo')
            .send({
                ID_PEDIDO: 1,
                USERNAME: 'ANGEL_SEQ_DOS',
                ID_PRODUCTO: 25,
                CANTIDAD: 10,
                SUB_TOTAL: 125.2
            })
        .end(function(err,res) {
            expect(res.body).to.be.a('string');
            expect(res.body).to.be.equal('Pedido en camino');
            expect(res).to.have.status(200);
            done()
        })
    }) 

    it('Probando encontrar el ID del ultimo pedido hecho', (done)=> {
        chai.request(url)
            .get('/pedidos/maximo')
        .end(function(err,res) {
            expect(res.body).to.be.a('number');
            expect(res).to.have.status(200);
            done()
        })
    })
})


describe('Testeando los endpoints para ordenes', ()=> {
    it('Probando la creacion de una nueva orden',(done)=>{
        chai.request(url)
            .post('/ordenes/nueva')
            .send({
                ID_ORDEN: 14,
                USERNAME: 'ANGEL_SEQ_CRUZ',
                ID_PEDIDO: 2,
                STATUS: 'En camino',
                TOTAL: 2225
            })
        .end(function(err,res){ 
            expect(res.body).to.be.a('string');
            expect(res.body).to.be.equal('Nueva orden agregada');
            expect(res).to.have.status(200);
            done()
        })
    })

    it('Probando encontrar el ID de la ultima orden hecha',(done)=> {
        chai.request(url)
            .get('/ordenes/maxima')
        .end(function(err,res){ 
            expect(res.body).to.be.a('number');
            expect(res).to.have.status(200);
            done()
        })
    })
})


describe('Testeando los endpoints para las categorias', ()=> {
    it('Probando a consultar las categorias', function(done) {
        chai.request(url)
            .get('/categ')
        .end(function(err,res) {
            expect(res.body).to.be.an('array');
            res.body.forEach(element => {
                expect(element).to.be.an('object');
                expect(element).to.have.keys('ID_CATEGORIA','NOMBRE','IMAGEN');
            });
            expect(res).to.have.status(200)
            done()
        })
    })
    
    it('Probando a crear una nueva categoria', function(done){
        chai.request(url)
            .post('/categ')
            .send({
                nombre: 'COCINA',
                imagen: 'COCINA.JPG'
            })
        .end(function(err,res) {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('ID_CATEGORIA','NOMBRE','IMAGEN');
            expect(res).to.have.status(201);
            done()
        })
    })

    it('Probando a actualizar una categoria', function(done) {
        chai.request(url)
            .put('/categ')
            .send({
                id: 2,
                nombre: 'COCINA',
                imagen: 'NUEVA.JPG'
            })
        .end(function(err,res) {
            expect(res.body).to.be.a('string')
            expect(res.body).to.be.equal("Categoria actualizada con exito [SERVICE]")
            done()
        })
    })

    it('Probando a dar de baja una categoria', function(done) {
        chai.request(url)
            .delete('/categ')
            .send({
                id: 2,
                nombre: 'COCINA',
                imagen: 'NUEVA.JPG'
            })
        .end(function(err,res){ 
            expect(res.body).to.be.a('string');
            expect(res.body).to.be.equal("Categoria eliminada con exito [SERVICE]");
            expect(res).to.have.status(200);
            done()
        })
    })
})


describe('Testeando los endpoints para productos', ()=> {
    it('Probando a consultar los productos',function(done) {
        chai.request(url)
            .get('/productos')
        .end(function(err,res) {
            expect(res.body).to.be.an('array');
            res.body.forEach(element=> {
                expect(element).to.be.an('object');
                expect(element).to.have.keys('ID_PRODUCTO','ID_CATEGORIA','NOMBRE','IMAGEN','PRECIO');
                expect(element.ID_PRODUCTO).to.be.a('number');
                expect(element.ID_PRODUCTO % 1).to.be.equal(0);
                expect(element.ID_CATEGORIA).to.be.a('number');
                expect(element.ID_CATEGORIA %1 ).to.be.equal(0);
                expect(element.NOMBRE).to.be.a('string');
                expect(element.IMAGEN).to.be.a('string');
                expect(element.PRECIO).to.be.a('number');
            });
            expect(res).to.have.status(200)
            done()
        })
    })

    it('Probando a crear un nuevo producto' ,function(done) { 
        chai.request(url)
            .post('/productos')
            .send( {
                idCategoria: 1,
                nombre: 'Llantas para nieve',
                precio: 128.5,
                imagen: 'Llantas.jpg'
            })
        .end(function(err,res) {
            expect(res.body).to.be.an('object');
            expect(res.body.ID_CATEGORIA).to.be.a('number');
            expect(res.body.ID_PRODUCTO).to.be.a('number');
            expect(res.body.PRECIO).to.be.a('number');
            expect(res.body.NOMBRE).to.be.a('string');
            expect(res).to.have.status(201);
            done()
        })
    })

    it('Probando a actualizar un producto' , function(done) {
        chai.request(url)
            .put('/productos')
            .send({
                id: 4,
                idCategoria: 'ACCESORIOS PARA AUTOS',
                nombre: 'Llantas para nieve',
                precio: 123.6,
                imagen: 'nuevaimagen.jpg'
            })
        .end(function(err,res) {
            expect(res.body).to.be.a('string');
            expect(res.body).to.be.equal("Producto actualizado con exito [SERVICE]");
            expect(res).to.have.status(200);
            done();
        })
    })

    it('Probando a eliminar un producto', function(done) {
        chai.request(url)
            .delete('/productos')
            .send( {
                id: 4,
                idCategoria: 'ACCESORIOS PARA AUTOS',
                nombre: 'Llantas para nieve',
                precio: 123.6,
                imagen: 'nuevaimagen.jpg'
            })
        .end(function(err,res) {
            expect(res.body).to.be.a('string');
            expect(res.body).to.be.equal("Producto eliminado con exito [SERVICE]");
            expect(res).to.have.status(200);
            done();
        })
    })
})