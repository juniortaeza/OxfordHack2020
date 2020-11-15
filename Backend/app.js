import express from "express"
const app = express()
import path from "path"
import bodyParser from "body-parser"
import cors from "cors"
import fs from "fs"
import { createModelScript } from './parser.js'
import { createConnections } from './parser.js'

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



// Capacitor: 'fl_lib/Electrical/Electrical Elements/Capacitor',
//         Controlled_Voltage_Source:'fl_lib/Electrical/Electrical Sources/Controlled Voltage Source',
//         Electrical_Reference:'fl_lib/Electrical/Electrical Elements/Electrical Reference',
//         PS_Simulink_Converter: 'nesl_utility/PS-Simulink Converter',
//         Resistor:'fl_lib/Electrical/Electrical Elements/Resistor',
//         Incandescent_Lamp:'ee_lib/Passive/Incandescent Lamp',
//         Simulink_PS_Converter:'nesl_utility/Simulink-PS Converter',
//         Solver_Configuration:'nesl_utility/Solver Configuration',
//         Voltage_Sensor:'fl_lib/Electrical/Electrical Sensors/Voltage Sensor',
//         Scope:'simulink/Commonly Used Blocks/Scope',
//         Step:'simulink/Sources/Step',




var connections = [{
	"name": "Controlled_Voltage_Source_Left",
	"connected": ["HWire_Right_10"]
}, {
	"name": "Controlled_Voltage_Source_Right",
	"connected": ["HWire_Left_9"]
}, {
	"name": "HWire_Right_10",
	"connected": ["Controlled_Voltage_Source_Left"]
}, {
	"name": "HWire_Left_10",
	"connected": ["VWire_Left_2"]
}, {
	"name": "HWire_Left_9",
	"connected": ["Controlled_Voltage_Source_Right"]
}, {
	"name": "HWire_Right_9",
	"connected": ["VWire_Left_3"]
}, {
	"name": "VWire_Right_6",
	"connected": []
}, {
	"name": "VWire_Left_6",
	"connected": []
}, {
	"name": "VWire_Left_5",
	"connected": []
}, {
	"name": "VWire_Right_5",
	"connected": []
}, {
	"name": "HWire_Right_7",
	"connected": []
}, {
	"name": "HWire_Left_7",
	"connected": []
}, {
	"name": "HWire_Left_5",
	"connected": []
}, {
	"name": "HWire_Right_5",
	"connected": []
}, {
	"name": "HWire_Right_8",
	"connected": []
}, {
	"name": "HWire_Left_8",
	"connected": []
}, {
	"name": "HWire_Left_6",
	"connected": ["Capacitor_Right", "VWire_Left_1"]
}, {
	"name": "HWire_Right_6",
	"connected": ["VWire_Right_3"]
}, {
	"name": "Capacitor_Left",
	"connected": ["Resistor_Right", "VWire_Left_4"]
}, {
	"name": "Capacitor_Right",
	"connected": ["HWire_Left_6", "VWire_Left_1"]
}, {
	"name": "VWire_Right_1",
	"connected": ["Voltage_Sensor_Right"]
}, {
	"name": "VWire_Left_1",
	"connected": ["Capacitor_Right", "HWire_Left_6"]
}, {
	"name": "VWire_Left_2",
	"connected": ["HWire_Left_10"]
}, {
	"name": "VWire_Right_2",
	"connected": ["Resistor_Left"]
}, {
	"name": "VWire_Right_3",
	"connected": ["HWire_Right_6"]
}, {
	"name": "VWire_Left_3",
	"connected": ["HWire_Right_9"]
}, {
	"name": "VWire_Left_4",
	"connected": ["Resistor_Right", "Capacitor_Left"]
}, {
	"name": "VWire_Right_4",
	"connected": ["Voltage_Sensor_Left"]
}, {
	"name": "HWire_Right _4",
	"connected": []
}, {
	"name": "HWire_Left_4",
	"connected": []
}, {
	"name": "HWire_Left_3",
	"connected": []
}, {
	"name": "HWire_Right _3",
	"connected": []
}, {
	"name": "HWire_Right_2",
	"connected": []
}, {
	"name": "HWire_Left _2",
	"connected": []
}, {
	"name": "HWire_Left_1",
	"connected": []
}, {
	"name": "HWire_Right_1",
	"connected": []
}, {
	"name": "Resistor_Left",
	"connected": ["VWire_Right_2"]
}, {
	"name": "Resistor_Right",
	"connected": ["Capacitor_Left", "VWire_Left_4"]
}, {
	"name": "Amper_Right",
	"connected": []
}, {
	"name": "Amper_Left",
	"connected": []
}, {
	"name": "Voltage_Sensor_Left",
	"connected": ["VWire_Right_4"]
}, {
	"name": "Voltage_Sensor_Right",
	"connected": ["VWire_Right_1"]
}, {
	"name": "Incandescent_Lamp_Right",
	"connected": []
}, {
	"name": "Incandescent_Lamp_Left",
	"connected": []
}]



app.listen(5010)
