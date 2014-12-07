var express = require('express');
var bodyParser = require("body-parser");
var modelos = require("./modelos/baseSync.js");

var app = express();
app.set('views','./vista');
app.set('view engine','jade');
app.use(express.static(__dirname + '/vista'));

app.use(bodyParser.urlencoded({
  extended: false
}));


app.get('/',function(req,res){
  res.render('home',{
    title: 'Bienvenido'
  });
});

app.get('/register',function(req,res){
  res.render('register',{
    title: 'Registrar Cuenta'
  });

});

app.get('/login',function(req,res){
  res.render('login',{
    title: 'Ingresar'
  })
});

app.get('/participante',function(req,res){
  res.render('participante',{
    title: 'Participante'
  });
});

app.get('/organizador',function(req,res){
  res.render('organizador',{
    title: 'Organizador'
  });
});

app.get('/expositor',function(req,res){
  res.render('expositor',{
    title: 'Expositor'
  });
});

app.post('/loginTest',function(req,res){
  var user = req.body.user;
  var pass = req.body.password;

  res.send('user: ' + user + ' password: ' + pass);

});

app.post("/login",function(req,res){
  var username = req.body.user;
  var pass = req.body.password;

  modelos.usuario.find({
    where: {
      user: username
    },
    include:[{
      model: modelos.usuarioRol,
      as: "usuario_rol"
    }]
  }).success(function(usuario){
    if(usuario != null){
      var passwd = usuario.password;
      if(pass == passwd){
        var rolid = usuario.usuario_rol[0].rol_id;
        modelos.rol.find({
          where:{
            id: rolid
          },
          include:[{
            model: modelos.rolFuncion,
            as: "rol_funcion"
          }]
        }).success(function(rol){
          var funciones = rol.rol_funcion;
          var i = 0;
          var func = [];
          funciones.forEach(function(funcion){
            func[i++] = funcion.funcion_nombre;
          });

          func.forEach(function(fun){
            console.log(fun);
          });


        });

      }else{
        res.send("password incorrecto");
      }


    }else{
        res.send("usuario no encontrado");
    }
  });

});

/*
app.post("/login",function(req,res){
  var username = req.body.user;
  var pass = req.body.password;
  //var pass = req.body.password;
  modelos.usuario.find(username).success(function(usuario){
    if(usuario != null){
      if(pass == usuario.password){
      modelos.usuario.find({
        where:{
          user: username
        },
        include:[{
          model: modelos.usuarioRol,
          as: "usuario_rol"
        }]
      }).success(function(usuario){
          var idrol = usuario.usuario_rol[0].rol_id
          if(idrol == 1){
            res.render("participante",{
              title: 'Participante'
            });
          }

          if(idrol == 2){
            res.render("organizador",{
              title: 'Organizador'
            });
          }

      });//fin
      }else{
        res.send("password incorrecto");
      }
    }else{
      res.send("el usuario no existe");
    }

  });

});*/

app.post("/register",function(req,res){
    var usuario = req.body.user;
    var pass = req.body.password;
    var nombre = req.body.nombre;
    var correo = req.body.email;
    var rol = req.body.rol;

    var usuarioNuevo = modelos.usuario.build({
      user: usuario,
      password: pass,
      nombre: nombre,
      email: correo
    });

    usuarioNuevo.save();
    regRol(rol,usuario);

    res.send("usuario registrado");
});


function regRol(rol, usuario){

  var usuarioRol = {
    usuario_user: usuario,
    rol_id: 1,
    fecha: new Date()
  };

  if(rol == "participante"){
    usuarioRol.rol_id = 1;
  }

  if(rol == "organizador"){
    usuarioRol.rol_id = 2;
  }

  var userRol = modelos.usuarioRol.build(usuarioRol);

  userRol.save();

}


app.listen(8080);