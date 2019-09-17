const Discord = require("discord.js");
const client = new Discord.Client();
const path = require("path");
const fs = require("fs");
const dir = path.join(__dirname, "sesiones");
const sesiones = [];

//---------------------------------- Sesiones ----------------------------------
/*
fs.readdir(dir, function(err, files) {
  //Manejar error
  if (err) {
    return console.log("Imposible leer el fichero: " + err);
  }
  if ((files.length != 0)) {
    console.log("-----------------------------------------------");
    console.log(" Sesiones: ");
    //Listar todos los documentos de sesión
    files.forEach((file) => {
      // Imprimir sesiones
      console.log(">" + file);
      let status = require(file);
      sesiones.push(file);
    });
  }
});*/

fs.readdir(dir, function(err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(function(file) {
    // Do whatever you want to do with the file
    sesiones.push(file);
  });
});
//---------------------------------- Conexión ----------------------------------

client.on("ready", () => {
  console.log("");
  console.log("Conectado como " + client.user.tag);
  console.log("-----------------------------------------------");
  console.log("Servidores: ");
  client.user.setActivity("la fragilidad humana", { type: "WATCHING" });

  client.guilds.forEach(guild => {
    console.log("");
    console.log("[ " + guild.name + " ]");
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

  let generalChannel = client.channels.get("623417353484369933");
  generalChannel.send("Conectado").then(msg => {
    msg.delete(1000);
  });
  generalChannel.send("--------------- Sesiones ---------------").then(msg => {
    msg.delete(30000);
  });
  console.log("");
  console.log("------------------- Sesiones ------------------");
  // Comprobamos las sesiones
  client.guilds.forEach(servidor => {
    generalChannel.send("[" + servidor.name + "]").then(msg => {
      msg.delete(30000);
    });
    if (sesiones.includes(servidor.id + ".json")) {
      let sesion = new Object();
      fs.readFile(
        "./sesiones/" + servidor.id + ".json",
        "utf8",
        (err, jsonString) => {
          if (err) {
            console.log("Fallo de lectura:", err);
            return;
          }
          sesion = JSON.parse(jsonString);
          generalChannel
            .send("- [Enable]=" + sesion.enable + " [Día]=" + sesion.dia)
            .then(msg => {
              msg.delete(30000);
            });
          console.log("[ "+servidor.name+" ] "+"- [Enable]=" + sesion.enable + " [Día]=" + sesion.dia);
        }
      );
    } else {
      generalChannel.send("- NO existe archivo de sesión").then(msg => {
        msg.delete(30000);
      });
      console.log("- NO existe archivo de sesión");
      let sesion = new Object();
      sesion.enable = false;
      sesion.players = [];
      sesion.dia = 0;
      sesion.string;
      fs.writeFile(
        "./sesiones/" + servidor.id + ".json",
        JSON.stringify(sesion),
        "utf8",
        err => {
          if (err) throw err;
          generalChannel.send("  Archivo creado").then(msg => {
            msg.delete(30000);
          });
        }
      );
      console.log("  Archivo creado");
      fs.readFile(
        "./sesiones/" + servidor.id + ".json",
        "utf8",
        (err, jsonString) => {
          if (err) {
            console.log("Fallo de lectura:", err);
            return;
          }
          sesion = JSON.parse(jsonString);
        }
      );
      generalChannel
        .send("- [Enable]=" + sesion.enable + " [Día]=" + sesion.dia)
        .then(msg => {
          msg.delete(30000);
        });
      console.log("- [Enable]=" + sesion.enable + " [Día]=" + sesion.dia);
    }
  });
});

//---------------------------------- Comandos ----------------------------------

client.on("message", receivedMessage => {
  if (receivedMessage.author == client.user) {
    return;
  }

  if (
    receivedMessage.content.startsWith("!") &&
    receivedMessage.channel.name == "losjuegosdeladieta"
  ) {
    processCommand(receivedMessage);
    receivedMessage.delete(2000);
  }
});

function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1);
  let splitCommand = fullCommand.split(" ");
  let primaryCommand = splitCommand[0];
  let arguments = splitCommand.slice(1);
  let ayuda = [
    "help",
    "ayuda",
    "--help",
    "-help",
    "info",
    "Ayuda",
    "HELP",
    "Help",
    "WELP",
    "Welp",
    "welp"
  ];

  if (ayuda.includes(primaryCommand)) {
    helpCommand(arguments, receivedMessage);
    if (primaryCommand == "WELP") {
      receivedMessage.channel
        .send({
          files: [{ attachment: "./assets/woah.jpeg", name: "woah.jpg" }]
        })
        .then(msg => {
          msg.delete(30000);
        });
    }
  }
}

function helpCommand(arguments, receivedMessage) {
  if (arguments.length == 0) {
    receivedMessage.channel
      .send("Aquí va un texto to currau de ayuda")
      .then(msg => {
        msg.delete(30000);
      });
  } else {
    receivedMessage.channel
      .send("Lol ayudaaa, el argumento ayuda no tiene argumentos looool")
      .then(msg => {
        msg.delete(5000);
      });
  }
}

//---------------------------------- Loginbot ----------------------------------

client.login("NTMzNjU1OTk5Mzk1OTIxOTI0.XYCJMg.KrLCd1DpdprXUWQo_pbP_XW-TxU");
