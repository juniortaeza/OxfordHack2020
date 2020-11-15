// check volt meter is in parrallel, check by looking at both hwires, and that they connect to a component



const modelName = 'mymodel'


export function createModelScript(components){
    var script =  createModelInstance()
    script += addBlocks(components)
    script += setBlockParams()
    script += getPortHandles(components)
    script += hardCodedConnections()
    script += makeItPretty()
    return script
}

function createModelInstance(){
    var str = 'function new_model(modelname)' + '\n' + 
      `if nargin == 0 \n modelname = '${modelName}';\n end \n` +
    `% create and open the model \n open_system(new_system(modelname)); \n`
    return str
}


//gets array of components
function addBlocks(components){
    var str = ''
    for(var i = 0; i<components.length; i++){
        str += addBlock(components[i]) +'\n'
    }
    str += setBlockParams()
    return str
}

//returns MATLAB code, for creation of component
function addBlock(component){
    var path = getComponentFilePath(component)
    var componentName = getModelComponentName(component)
    var codeML = `add_block('${path}','${componentName}')`
    return codeML
}

function setBlockParams(){
    return setDefaultSolver() +'\n' +  setCapacitance()
}

// set_param(modelname,'Solver','ode15s');
function setDefaultSolver(){
    return `set_param('${modelName}', 'Solver', 'ode15s') \n`
}

// set_param('mymodel/Capacitor', 'c', '1')
function setCapacitance(){
    const CAPACITOR = 'Capacitor'
    const PARAMNAME = 'c'
    const VALUE = '1'
    return `set_param('${getModelComponentName(CAPACITOR)}', '${PARAMNAME}','${VALUE}') \n`
}


//return files path ofthe component
function getComponentFilePath(component){

    if(component == 'PS-Simulink Converter'){
        component = 'PS_Simulink_Converter'
    }
    if(component == 'Simulink-PS Converter'){
        component = 'Simulink_PS_Converter'
    }

    component = component.split(" ").join("_")



    const filePathsDictionary = {
        Capacitor: 'fl_lib/Electrical/Electrical Elements/Capacitor',
        Controlled_Voltage_Source:'fl_lib/Electrical/Electrical Sources/Controlled Voltage Source',
        Electrical_Reference:'fl_lib/Electrical/Electrical Elements/Electrical Reference',
        PS_Simulink_Converter: 'nesl_utility/PS-Simulink Converter',
        Resistor:'fl_lib/Electrical/Electrical Elements/Resistor',
        Incandescent_Lamp:'ee_lib/Passive/Incandescent Lamp',
        Simulink_PS_Converter:'nesl_utility/Simulink-PS Converter',
        Solver_Configuration:'nesl_utility/Solver Configuration',
        Voltage_Sensor:'fl_lib/Electrical/Electrical Sensors/Voltage Sensor',
        Scope:'simulink/Commonly Used Blocks/Scope',
        Step:'simulink/Sources/Step',
        }
    return filePathsDictionary[component]
}

function getPortHandles(components){
    var str = ''
    for(var i = 0; i<components.length; i++){
        str = str + getPortHandle(components[i]) +'\n'
    }
    return str
}

//initialises a variable called component that hold a reference to the porthandles 
//e.g. step = get_param('mymodel/Step','PortHandles')
function getPortHandle(component){
    const PORTHANDLE = 'PortHandles'
    var componentVar = component.split('-').join('_').split(' ').join('_')
    return `${componentVar} = get_param('${getModelComponentName(component)}', '${PORTHANDLE}')`
}


function getModelComponentName(component){
    return `${modelName}/${component}`
}

function hardCodedConnections(){
return `add_line('mymodel',Step.Outport,Simulink_PS_Converter.Inport);
add_line('mymodel',Simulink_PS_Converter.RConn,Controlled_Voltage_Source.RConn(1));

add_line('mymodel',Controlled_Voltage_Source.LConn,Resistor.LConn);
add_line('mymodel', Resistor.RConn, Capacitor.LConn);
% add_line('mymodel',Controlled_Voltage_Source.LConn,Incandescent_Lamp.LConn);
% add_line('mymodel', Incandescent_Lamp.RConn, cap.LConn);

add_line('mymodel', Capacitor.RConn, Electrical_Reference.LConn);
add_line('mymodel', Electrical_Reference.LConn, Controlled_Voltage_Source.RConn(2));
add_line('mymodel', Solver_Configuration.RConn, Controlled_Voltage_Source.RConn(2))
add_line('mymodel',Voltage_Sensor.LConn,Capacitor.LConn)
add_line('mymodel',Voltage_Sensor.RConn(2),Capacitor.RConn)
add_line('mymodel',Voltage_Sensor.RConn(1),PS_Simulink_Converter.LConn)
add_line('mymodel',PS_Simulink_Converter.Outport,Scope.Inport)`

}

function makeItPretty(){
    return `\n Simulink.BlockDiagram.arrangeSystem('mymodel')`
}







function findComponentIndexByName(componentName,connections){
    for(var i =0; i < connections.length(); i++){
        if(connections[i].name == componentName){
            return i;
        }
    } console.log("ERROR!!!, Component not found")
}


export function createConnections(connections){
        
    var parallelComponents = findParallelWireComponents(connections) 

        //not wire in parallel
        //iterates through all components, starting from Voltage
        const BatteryName = 'Controlled_Voltage_Source'
        var component = BatteryName + '_Left'
        var componentIndex = findComponentIndexByName(component)
        var componentConnectedTo 

        while(true){
            component = componentConnectedTo 
            componentIndex = findComponentIndexByName(component)
   
            if(component==BatteryName+'_Right'){
                console.log("component:" + component + " componentconnectedTo"+componentConnectedTo)
                break;
            }
            if(connections[componentIndex].connected.size() > 1){
                componentConnectedTo = findNonParallelWireComponent(connections[componentIndex].connected,parallelComponents)         
            } else{
                componentConnectedTo = connections[componentIndex].connected[0]
            }

            componentIndex = findComponentIndexByName(componentConnectedTo)

            while(isWire(componentConnectedTo)){    //iterate through until the connection hits a non wire component
                                
                componetConnectedTo = otherSideOfComponent(componentConnectedTo)   //find the wires opposite side
                componentIndex = findComponentIndexByName(componentConnectedTo)

                if(connections[componentIndex].connected.size() > 1){
                    componentConnectedTo = findNonParallelWireComponent(connections[i].connected,parallelComponents)         
                }
            }

            //code to create matlab code
            console.log("component:" + component + " componentconnectedTo"+componentConnectedTo)
            
            // if(!isWire(connections[i]) && !isVoltageSensor()){
            //     var componentName = getComponentName(connections[i])
                
        
            //     createMatLabConnectionCode(connections[i],leftConnComp,rightConnComp)
            // }
        }
        
    
    //iterate through the array of connections,
    //if is not wire
    //for each component find it's left and right connection 
}

//returns array of wires connected to voltmeter
function findParallelWireComponents(connections){
    var wiresParallel = []
    for(var i = 0; i < connections.length; i++){
        if(isVoltageSensor(connections[i].name)){
            wiresParallel.push(connections[i].connected[0])
        }
    }
    console.log('wires in parallel'+ wiresParallel)
    return wiresParallel
}

function findNonParallelWireComponent(connections,parallelWires){
    

    //both wires and one is parallel
    if(connections[0].toLowerCase().includes('wire') && connections[1].toLowerCase().includes('wire')){
        var orientation = parallelWires[0].charAt(0)
        var orientation2 = parallelWires[1].charAt(0)
        var wireNumber = parallelWires[0].charAt(parallelWires[0].length-1)
        var wireNumber2 = parallelWires[1].charAt(parallelWires[1].length-1)


        if(connection[0].charAt(0) == orientation && connections[0].includes(wireNumber)){
            return connection[1]
        }
        if(connection[0].charAt(0) == orientation2 && connections[0].includes(wireNumber2)){
            return connection[1]
        }
        if(connection[1].charAt(0) == orientation && connections[1].includes(wireNumber)){
            return connection[0]
        }
        if(connection[1].charAt(0) == orientation2 && connections[1].includes(wireNumber2)){
            return connection[0]
        }
    }
    //only one wire the other is a nonwirecomponenet so return that
    if(connections[0].toLowerCase().includes('wire')){
        return connections[1]
    }else{
        return connections[0]
    }


}

function otherSideOfComponent(component,connections){
    const RIGHT = '_Right'
    const LEFT = '_Left'

    var isLeft = component.toLowerCase().includes('left')
    for(var i = 0; i< connections.length; i++){
        if(component.toLowerCase.includes('wire')){
            var wireNumber = component.split('_').pop()
            if(isLeft){
                return component.split('_').pop().pop().toString() + RIGHT + wireNumber
            } else{
                return component.split('_').pop().pop().toString() + LEFT + wireNumber
            }
        } else{
            if(isLeft){
                return component.split('_').pop().toString() + RIGHT
            }else{
                return component.split('_').pop().toString() + LEFT
            }     
        }
    }

}

function isVoltageSensor(component){
    const Voltage_SensorLEFT = "Voltage_Sensor_Left"
    const Voltage_SensorRIGHT = "Voltage_Sensor_Right"
    return component == Voltage_SensorLEFT || component == Voltage_SensorRIGHT
}

function isWire(component){
    return component.toLowerCase().includes('wire')
}

function notWireInParallel(component){
}


// function findLeftConnectedComponent(componentConnection){
//     //search for it in the JSON,
//     // find left connection, 
//     //if left is wire then find same wire
// }

// if(!isWire(connections[i]) && !isVoltageSensor()){
//     var componentName = getComponentName(connections[i])
//     if(isLeftSideOfComponent()){
//         leftConnComp = findLeftConnectedComponent(connections[i])
//         rightConnComp = findRightConnectedComponent(componentName + "_Right")
//     } else{

//     }
//     createMatLabConnectionCode(connections[i],leftConnComp,rightConnComp)
// }





function getComponentName(connection){
    //remove left or right
}






/*
function new_model(modelname) 
% NEW_MODEL Create a new, empty Simulink model
%    NEW_MODEL('MODELNAME') creates a new model with
%    the name 'MODELNAME'. Without the 'MODELNAME'
%    argument, the new model is named 'my_untitled'.

if nargin == 0 
     modelname = 'mymodel';
end 

% create and open the model
open_system(new_system(modelname));

% set default screen color
%  set_param(modelname,'ScreenColor','green');

% set default solver
set_param(modelname,'Solver','ode15s');


% add_block('simulink/Sources/Sine Wave','mymodel/Sine1');
% set_param('mymodel/Sine1','position',[140,80,180,120]);

add_block('fl_lib/Electrical/Electrical Elements/Capacitor','mymodel/Capacitor')
set_param('mymodel/Capacitor', 'c', '1')

add_block('fl_lib/Electrical/Electrical Sources/Controlled Voltage Source','mymodel/Controlled Voltage Source')

add_block('fl_lib/Electrical/Electrical Elements/Electrical Reference','mymodel/Electrical Reference')

add_block('nesl_utility/PS-Simulink Converter','mymodel/PS-Simulink Converter')

add_block('fl_lib/Electrical/Electrical Elements/Resistor','mymodel/Resistor')
% add_block('ee_lib/Passive/Incandescent Lamp', 'mymodel/Incandescent Lamp')

add_block('nesl_utility/Simulink-PS Converter','mymodel/Simulink-PS Converter')

add_block('nesl_utility/Solver Configuration','mymodel/Solver Configuration')

add_block('fl_lib/Electrical/Electrical Sensors/Voltage Sensor','mymodel/Voltage Sensor')

add_block('simulink/Commonly Used Blocks/Scope','mymodel/Scope')

add_block('simulink/Sources/Step','mymodel/Step')

step = get_param('mymodel/Step','PortHandles')
simps = get_param('mymodel/Simulink-PS Converter','PortHandles')
cvs = get_param('mymodel/Controlled Voltage Source','PortHandles')
res = get_param('mymodel/Resistor','PortHandles')
% lamp = get_param('mymodel/Incandescent Lamp','PortHandles') 
cap = get_param('mymodel/Capacitor','PortHandles')
eref = get_param('mymodel/Electrical Reference','PortHandles')
pssim = get_param('mymodel/PS-Simulink Converter','PortHandles')
solconf = get_param('mymodel/Solver Configuration','PortHandles')
volsens = get_param('mymodel/Voltage Sensor','PortHandles')
scop = get_param('mymodel/Scope','PortHandles')

add_line('mymodel',step.Outport,simps.Inport);
add_line('mymodel',simps.RConn,cvs.RConn(1));

add_line('mymodel',cvs.LConn,res.LConn);
add_line('mymodel', res.RConn, cap.LConn);
% add_line('mymodel',cvs.LConn,lamp.LConn);
% add_line('mymodel', lamp.RConn, cap.LConn);

add_line('mymodel', cap.RConn, eref.LConn);
add_line('mymodel', eref.LConn, cvs.RConn(2));
add_line('mymodel', solconf.RConn, cvs.RConn(2))
add_line('mymodel',volsens.LConn,cap.LConn)
add_line('mymodel',volsens.RConn(2),cap.RConn)
add_line('mymodel',volsens.RConn(1),pssim.LConn)
add_line('mymodel',pssim.Outport,scop.Inport)


% save the model
%save_system(modelname)

*/

// connections = [{
// 	"name": "Controlled_Voltage_Source_Left",
// 	"connected": ["HWire_Right_10"]
// }, {
// 	"name": "Controlled_Voltage_Source_Right",
// 	"connected": ["HWire_Left_9"]
// }, {
// 	"name": "HWire_Right_10",
// 	"connected": ["Controlled_Voltage_Source_Left"]
// }, {
// 	"name": "HWire_Left_10",
// 	"connected": ["VWire_Left_2"]
// }, {
// 	"name": "HWire_Left_9",
// 	"connected": ["Controlled_Voltage_Source_Right"]
// }, {
// 	"name": "HWire_Right_9",
// 	"connected": ["VWire_Left_3"]
// }, {
// 	"name": "VWire_Right_6",
// 	"connected": []
// }, {
// 	"name": "VWire_Left_6",
// 	"connected": []
// }, {
// 	"name": "VWire_Left_5",
// 	"connected": []
// }, {
// 	"name": "VWire_Right_5",
// 	"connected": []
// }, {
// 	"name": "HWire_Right_7",
// 	"connected": []
// }, {
// 	"name": "HWire_Left_7",
// 	"connected": []
// }, {
// 	"name": "HWire_Left_5",
// 	"connected": []
// }, {
// 	"name": "HWire_Right_5",
// 	"connected": []
// }, {
// 	"name": "HWire_Right_8",
// 	"connected": []
// }, {
// 	"name": "HWire_Left_8",
// 	"connected": []
// }, {
// 	"name": "HWire_Left_6",
// 	"connected": ["Capacitor_Right", "VWire_Left_1"]
// }, {
// 	"name": "HWire_Right_6",
// 	"connected": ["VWire_Right_3"]
// }, {
// 	"name": "Capacitor_Left",
// 	"connected": ["Resistor_Right", "VWire_Left_4"]
// }, {
// 	"name": "Capacitor_Right",
// 	"connected": ["HWire_Left_6", "VWire_Left_1"]
// }, {
// 	"name": "VWire_Right_1",
// 	"connected": ["Voltage_Sensor_Right"]
// }, {
// 	"name": "VWire_Left_1",
// 	"connected": ["Capacitor_Right", "HWire_Left_6"]
// }, {
// 	"name": "VWire_Left_2",
// 	"connected": ["HWire_Left_10"]
// }, {
// 	"name": "VWire_Right_2",
// 	"connected": ["Resistor_Left"]
// }, {
// 	"name": "VWire_Right_3",
// 	"connected": ["HWire_Right_6"]
// }, {
// 	"name": "VWire_Left_3",
// 	"connected": ["HWire_Right_9"]
// }, {
// 	"name": "VWire_Left_4",
// 	"connected": ["Resistor_Right", "Capacitor_Left"]
// }, {
// 	"name": "VWire_Right_4",
// 	"connected": ["Voltage_Sensor_Left"]
// }, {
// 	"name": "HWire_Right _4",
// 	"connected": []
// }, {
// 	"name": "HWire_Left_4",
// 	"connected": []
// }, {
// 	"name": "HWire_Left_3",
// 	"connected": []
// }, {
// 	"name": "HWire_Right _3",
// 	"connected": []
// }, {
// 	"name": "HWire_Right_2",
// 	"connected": []
// }, {
// 	"name": "HWire_Left _2",
// 	"connected": []
// }, {
// 	"name": "HWire_Left_1",
// 	"connected": []
// }, {
// 	"name": "HWire_Right_1",
// 	"connected": []
// }, {
// 	"name": "Resistor_Left",
// 	"connected": ["VWire_Right_2"]
// }, {
// 	"name": "Resistor_Right",
// 	"connected": ["Capacitor_Left", "VWire_Left_4"]
// }, {
// 	"name": "Amper_Right",
// 	"connected": []
// }, {
// 	"name": "Amper_Left",
// 	"connected": []
// }, {
// 	"name": "Voltage_Sensor_Left",
// 	"connected": ["VWire_Right_4"]
// }, {
// 	"name": "Voltage_Sensor_Right",
// 	"connected": ["VWire_Right_1"]
// }, {
// 	"name": "Incandescent_Lamp_Right",
// 	"connected": []
// }, {
// 	"name": "Incandescent_Lamp_Left",
// 	"connected": []
// }]