const Discord = require("discord.js");
const path = require("path");
const fs = require("fs");
const client = new Discord.Client();
const dir = path.join(__dirname, "sesiones");
const linter = 3000;
const minter = 2000;
const sinter = 1000;
const logChannel = "623475133041868802";
const apiToken = "NTMzNjU1OTk5Mzk1OTIxOTI0.XYHhuQ.4LHlQu9l0Qd7FlfQ88NQ_aKKE8A";
const sesiones = [];
const helptxt = 'Texto de ayuda to currao (Hay que hacerlo)';
var sesion = new Object();
var generalChannel = new Object();
//---------------------------------- Sesiones ----------------------------------

//Generamos el array de archivos de sesiones
fs.readdir(dir, function(err, files) {
  //En caso de error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //Lista de ficheros con forEach
  files.forEach(function(file) {
    // Generar array Sesiones
    sesiones.push(file);
  });
});

//---------------------------------- Conexión ----------------------------------

//Conecta el bot y prepara todo
client.on("ready", () => {
  console.log("");
  console.log("Conectado como " + client.user.tag);
  console.log("-----------------------------------------------");
  console.log("Servidores: ");

  client.user.setActivity("la fragilidad humana", { type: "WATCHING" });
  client.guilds.forEach(guild => {
    console.log("");
    console.log("[ " + guild.name + " ]");

    // Si los canales se llaman "losjuegosdeladieta" y son de texto, entonces los printea
    guild.channels.forEach(channel => {
      if (channel.name == "losjuegosdeladieta" && channel.type == "text") {
        if (channel != guild.channels.last()) {
          console.log(`|->[ ${channel.name} ${channel.type} ${channel.id} ]`);
        } else {
          console.log(`'->[ ${channel.name} ${channel.type} ${channel.id} ]`);
        }
      }
    });
  });

  //Set the general channel
  generalChannel = client.channels.get(logChannel);
  
  //Comprobamos las sesiones
  checksessions();
});

// Esta función comprueba las sesiones
function checksessions(){
  
  generalChannel.send("Conectado").then(msg => {msg.delete(sinter);});
  generalChannel.send("--------------- Sesiones ---------------").then(msg => {msg.delete(linter);});
  console.log("");
  console.log("------------------- Sesiones ------------------");

  client.guilds.forEach(servidor => {
    if (sesiones.includes(servidor.id + ".json")) {

      
      fs.readFile("./sesiones/" + servidor.id + ".json","utf8",(err, jsonString) => {
          if (err) {
            console.log("Fallo de lectura:", err);
            return;
          }
          sesion = JSON.parse(jsonString);
          generalChannel.send("["+servidor.name+"]"+"- [Enable]=" + sesion.enable + " [Día]=" + sesion.dia).then(msg => {msg.delete(linter);});
          console.log("[ "+servidor.name +" ] " +"- [Enable]=" +sesion.enable +" [Día]=" +sesion.dia);
        }
      );

    } else {

      generalChannel.send("["+servidor.name+"]"+"- NO existe archivo de sesión").then(msg => {msg.delete(linter);});
      console.log("["+servidor.name+"]"+"- NO existe archivo de sesión");
      sesion.enable = false;
      sesion.players = [];
      sesion.dia = 0;
      sesion.string;
      fs.writeFile("./sesiones/" + servidor.id + ".json",JSON.stringify(sesion),"utf8",err => {
        if (err) throw err;
        generalChannel.send("["+servidor.name+"]"+"  Archivo creado").then(msg => {msg.delete(linter);});
        }
      );
      console.log("["+servidor.name+"]"+"  Archivo creado");
      fs.readFile("./sesiones/" + servidor.id + ".json","utf8",(err, jsonString) => {
          if (err) {
            console.log("Fallo de lectura:", err);
            return;
          }
          sesion = JSON.parse(jsonString);
        }
      );
      generalChannel.send("["+servidor.name+"]"+"- [Enable]=" + sesion.enable + " [Día]=" + sesion.dia).then(msg => {msg.delete(linter);});
      console.log("["+servidor.name+"]"+"- [Enable]=" + sesion.enable + " [Día]=" + sesion.dia);
    }
  });
}

//---------------------------------- Comandos ----------------------------------

//Sistema para procesar los mensajes
client.on("message", receivedMessage => {
  if (receivedMessage.author == client.user) {
    return;
  }

  if (
    receivedMessage.content.startsWith("!") &&
    receivedMessage.channel.name == "losjuegosdeladieta"
  ) {
    processCommand(receivedMessage);
    receivedMessage.delete(sinter);
  }
});


function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1);
  let splitCommand = fullCommand.split(" ");
  let primaryCommand = splitCommand[0];
  let arguments = splitCommand.slice(1);
  let ayuda = ["help","ayuda","--help","-help","info","Ayuda","HELP","Help","WELP","Welp","welp"];

  //Comando ayuda
  if (ayuda.includes(primaryCommand)) {
    helpCommand(arguments, receivedMessage);
    if (primaryCommand == "WELP") {
      receivedMessage.channel.send({files: [{ attachment: "./assets/woah.jpeg", name: "woah.jpg" }]}).then(msg => {msg.delete(linter);});
    }
  }

  //Comando habilitar
  if (primaryCommand = "enable"){
    enableCommand(receivedMessage);
  }

}

function helpCommand(arguments, receivedMessage) {
  if (arguments.length == 0) {
    receivedMessage.channel.send(helptxt).then(msg => {msg.delete(linter);});
  } else {
    receivedMessage.channel.send("Lol ayudaaa, el argumento ayuda no tiene argumentos looool").then(msg => {msg.delete(minter);});
  }
}

function enableCommand(receivedMessage) {
  fs.readFile("./sesiones/" + receivedMessage.guild.id + ".json","utf8",(err, jsonString) => {
    if (err) {
      console.log("Fallo de lectura:", err);
      return;
    }
      sesion = JSON.parse(jsonString);
      generalChannel.send("["+receivedMessage.guild.name+"]"+"- [Enable]=" + sesion.enable + " [Día]=" + sesion.dia).then(msg => {msg.delete(linter);});
      console.log("[ "+receivedMessage.guild.name +" ] " +"- [Enable]=" +sesion.enable +" [Día]=" +sesion.dia);
  });
  
  //Activar la sesión
  sesion.enable = true;

  if(sesion.players.length < 5){
    //Excepción no hay suficientes jugadores registrados
    generalChannel.send("No hay suficientes jugadores registrados").then(msg=>{msg.delete(linter)});
    console.log("No hay suficientes jugadores registrados");

  } else {
    fs.writeFile("./sesiones/" + receivedMessage.guild.id + ".json",JSON.stringify(sesion),"utf8",err => {
      if (err) throw err;
      generalChannel.send("["+servidor.name+"]"+"  Archivo creado").then(msg => {msg.delete(linter);});
    });
    generalChannel.send("Los juegos del hambre han sido habilitados");
  }
  }


//---------------------------------- Events   ----------------------------------

function presentation(){

}

//---------------------------------- Loginbot ----------------------------------

client.login(apiToken);