function new_model(modelname)
if nargin == 0 
 modelname = 'mymodel';
 end 
% create and open the model 
 open_system(new_system(modelname)); 
add_block('fl_lib/Electrical/Electrical Elements/Capacitor','mymodel/Capacitor')
add_block('fl_lib/Electrical/Electrical Sources/Controlled Voltage Source','mymodel/Controlled Voltage Source')
add_block('fl_lib/Electrical/Electrical Elements/Electrical Reference','mymodel/Electrical Reference')
add_block('nesl_utility/PS-Simulink Converter','mymodel/PS-Simulink Converter')
add_block('fl_lib/Electrical/Electrical Elements/Resistor','mymodel/Resistor')
add_block('ee_lib/Passive/Incandescent Lamp','mymodel/Incandescent Lamp')
add_block('nesl_utility/Simulink-PS Converter','mymodel/Simulink-PS Converter')
add_block('nesl_utility/Solver Configuration','mymodel/Solver Configuration')
add_block('fl_lib/Electrical/Electrical Sensors/Voltage Sensor','mymodel/Voltage Sensor')
add_block('simulink/Commonly Used Blocks/Scope','mymodel/Scope')
add_block('simulink/Sources/Step','mymodel/Step')
set_param('mymodel', 'Solver', 'ode15s') 

set_param('mymodel/Capacitor', 'c','1') 
set_param('mymodel', 'Solver', 'ode15s') 

set_param('mymodel/Capacitor', 'c','1') 
Capacitor = get_param('mymodel/Capacitor', 'PortHandles')
Controlled_Voltage_Source = get_param('mymodel/Controlled Voltage Source', 'PortHandles')
Electrical_Reference = get_param('mymodel/Electrical Reference', 'PortHandles')
PS_Simulink_Converter = get_param('mymodel/PS-Simulink Converter', 'PortHandles')
Resistor = get_param('mymodel/Resistor', 'PortHandles')
Incandescent_Lamp = get_param('mymodel/Incandescent Lamp', 'PortHandles')
Simulink_PS_Converter = get_param('mymodel/Simulink-PS Converter', 'PortHandles')
Solver_Configuration = get_param('mymodel/Solver Configuration', 'PortHandles')
Voltage_Sensor = get_param('mymodel/Voltage Sensor', 'PortHandles')
Scope = get_param('mymodel/Scope', 'PortHandles')
Step = get_param('mymodel/Step', 'PortHandles')
add_line('mymodel',Step.Outport,Simulink_PS_Converter.Inport);
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
add_line('mymodel',PS_Simulink_Converter.Outport,Scope.Inport)
 Simulink.BlockDiagram.arrangeSystem('mymodel')