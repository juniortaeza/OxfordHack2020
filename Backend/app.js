import express from "express"
const app = express()
import bodyParser from "body-parser"
import cors from "cors"
import fs from "fs"
import { createModelScript } from './parser.js'

app.use(bodyParser.json())
app.use(cors())

const components = ['Capacitor','Controlled Voltage Source','Electrical Reference','PS-Simulink Converter','Resistor',
            'Incandescent Lamp','Simulink-PS Converter','Solver Configuration','Voltage Sensor','Scope','Step']


app.get('/', function(req, res) {
    //createConnections(connections)
    res.send('hi');
    var script = createModelScript(components)
    console.log(script)
    createFile(script)

});

function createFile(script){
    fs.writeFile('mymodel.m', script, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
}



app.listen(5010)