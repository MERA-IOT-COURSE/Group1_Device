
const API_ROOT = 'api';
const API_DEVICES = '/devices';
const API_SENSORS = '/sensors';
const API_ACTIONS = '/actions';

/*  Structure of timer objects keeping
    {
        id: "device_id",
        sensors: [{timer: timer_1, data: "data_1"}, {timer: timer_2, data: "data_2"}, ...]
    }
*/
const SENSOR_DATA_LENGTH = 10;
var active_device = null;

/**********************************************  Test ajax function  **************************************************/
// TODO: Remove it, when testing is done
//       This function replaces ajax function to test client code without web server
// $.ajax = function(data) {
//     if (data.url == API_ROOT + API_DEVICES) {
//         var res_data = '[{"id": "123", "name": "Dev1"},{"id": "456", "name": "Dev2"}]';
//     } else if (data.url == API_ROOT + API_DEVICES + '/' + '123' + API_SENSORS ||
//                data.url == API_ROOT + API_DEVICES + '/' + '456' + API_SENSORS) {
//         var res_data = '[{"id": "222", "name": "Temperature", "actions": [{"id": "888", "name": "Light ON"},{"id": "889", "name": "Light OFF"}]},' +
//                        '{"id": "223", "name": "Humidity"},' +
//                        '{"id": "224", "name": "Other", "actions": [{"id": "888", "name": "Light ON"},{"id": "889", "name": "Light OFF"}]}]';
//     } else if (data.url == API_ROOT + API_DEVICES + '/' + '123' + API_ACTIONS ||
//                data.url == API_ROOT + API_DEVICES + '/' + '456' + API_ACTIONS) {
//         var res_data = '[{"id": "555", "name": "Turn ON"},{"id": "556", "name": "Turn OFF"},{"id": "557", "name": "Reboot"}]';
//     } else if (data.url == API_ROOT + API_DEVICES + '/' + '123' + API_ACTIONS + '/' + '555' ||
//                data.url == API_ROOT + API_DEVICES + '/' + '123' + API_ACTIONS + '/' + '556') {
//         var res_data = '{"res": "OK"}';
//     } else if (data.url == API_ROOT + API_DEVICES + '/' + '123' + API_ACTIONS + '/' + '557') {
//         var res_data = '{"res": "Fail. Reboot is not implemented"}';
//     } else if (data.url == API_ROOT + API_DEVICES + '/' + '123' + API_SENSORS + '/' + '222' ||
//                data.url == API_ROOT + API_DEVICES + '/' + '123' + API_SENSORS + '/' + '223' ||
//                data.url == API_ROOT + API_DEVICES + '/' + '123' + API_SENSORS + '/' + '224' ||
//                data.url == API_ROOT + API_DEVICES + '/' + '456' + API_SENSORS + '/' + '222' ||
//                data.url == API_ROOT + API_DEVICES + '/' + '456' + API_SENSORS + '/' + '223' ||
//                data.url == API_ROOT + API_DEVICES + '/' + '456' + API_SENSORS + '/' + '224') {
//         let max = 100
//         let min = 0
//         let v = Math.floor(Math.random() * (max - min + 1)) + min
//         var res_data = '{"value": ' + v + '}';
//     } else {

//         throw "No TEST function for URL: " + data.url;
//     }

//     let res = {done: function(func) { func(res_data); return res; },
//                fail: function(func) { return res; } }
//     return res
// }


/**********************************************  get_device_list  **************************************************/


let add_device_tab = function(device_tabs, id, name) {
    /*  Create new tab with specified device id and name  */
    console.log('Adding tab (id=' + id + ', name=' + name + ')');

    let device_headers = device_tabs.children('ul');
    let device_id = 'device_' + id

    // Creating header: <li><a href="#device_id">device_name</a></li>
    let device_header = $('<li>', {id: id}).append($('<a>', {href: '#' + device_id, text: name}));
    device_headers.append(device_header);

    // Creating empty body; body will be downloaded, when tab is active
    let device_body = $('<div>', {id: device_id});
    $('<div>', {name: 'actions', class: 'actions'}).appendTo(device_body);
    $('<div>', {name: 'sensors', class: 'sensors'}).appendTo(device_body);
    device_tabs.append(device_body);
}


let create_device_widget = function(data) {
    /*  Parse JSON data with device list and add each one as a tab
        Assume that JSON data format is:
           [
               {"id": "123", "name": "Device_1"},
               {"id": "456", "name": "Device_2"}
           ]
    */
    let devices_data = parse_data(data);
    let device_tabs = $('#device_list');
    devices_data.forEach(function(device, i, arr) {
        try {
            add_device_tab(device_tabs, device.id, device.name);
        } catch (error) {
            console.log('Adding device failed. Error: ' + error);
            show_error('Adding "' + device.name + '" device failed');
            throw error;
        }
    });
    // Refresh tabs to css be applied to them
    device_tabs.tabs("refresh");
    // Trigger the first device tab activation
    device_tabs.tabs("option", "active", 0);
}


function get_device_list() {
    /*  Get device list from server  */
    $.ajax({method: "GET",
            url: API_ROOT + API_DEVICES})
        .done(create_device_widget)
        .fail(function(jqXHR, textStatus, error) {
            console.log("Device list loading failed. Error: " + error);
            show_error('Device list loading failed');
            throw error;
        });
}


/***********************************************  get_device_info  ****************************************************/
let create_control_block = function() {
    /*  Create block with control buttons that start, stop and run once sensor refreshing  */
    let control_block = $("<div>", {class: 'control-block'});
    // Play
    $("<button>").button({icon: "ui-icon-play", showLabel: false})
                 .on('click', function(){
                    active_device.start_refreshing();
                 })
                 .appendTo(control_block);
    $("<button>").button({icon: "ui-icon-stop", showLabel: false})
                 .on('click', function(){
                    active_device.stop_refreshing();
                 })
                 .appendTo(control_block);
    $("<button>").button({icon: "ui-icon-arrowrefresh-1-e", showLabel: false})
                 .on('click', function(){
                                active_device.refresh_once();
                             })
                 .appendTo(control_block);
    return control_block
}


let create_sensor_widget = function(device_id, device_body, data) {
    /*
        Assume that JSON data format is:
           [
               {"id": "222", "name": "Temperature", "actions": [{"id": "888", "name": "Light ON"},
                                                                {"id": "889", "name": "Light OFF"}]},
               {"id": "223", "name": "Humidity"},
               {"id": "224", "name": "Prettiness", "actions": [{"id": "888", "name": "Light ON"},
                                                                {"id": "889", "name": "Light OFF"}]}
           ]
    */
    let sensors_data = parse_data(data);
    let sensor_widget = device_body.find('div[name="sensors"]');

    if (!sensor_widget.length) {
        show_error('Sensor list loading failed');
        throw 'Sensor list loading failed';
    }
    let sensors = [];
    sensor_widget.empty();
    sensor_widget.append($("<label>", {text: "Sensors:"}));
    sensor_widget.append(create_control_block());
    sensors_data.forEach(function(sensor, i, arr) {
        let sensor_block = $("<div>", {class: 'sensor-block'});
        let sensor_name = $("<label>", {class: 'sensor-name',
                                        text: sensor.name});
        let sensor_chart =  $("<div>", {class: 'sensor-chart',
                                        id: 'chart_' + device_id + '_' + sensor.id});
        sensor_block.append(sensor_chart);
        if ("actions" in sensor) {
            let sensor_action_block = $("<div>", {class: 'sensor-action-block'});
            sensor.actions.forEach(function(action, i, arr) {
                let action_button = $("<button>", {class: 'sensor-action',
                                                   text: action.name});
                action_button.on('click', function() {
                    $.ajax({method: "GET",
                            url: API_ROOT + API_DEVICES + '/' + device_id + API_SENSORS + '/' +
                                 sensor.id + API_ACTIONS + '/' + action.id})
                    .done(function(data) {
                        /*  Assume that JSON data format is:
                                {"res": "OK"} or {"res": "Failed due to function is not implemented"}
                        */
                        let res_data = parse_data(data);
                        if (res_data.res == 'OK') {
                            show_success('"' + action.name + '" action successfully executed');
                        } else {
                            show_error('"' + action.name + '" action failed. ' + res_data.res);
                        }
                    })
                    .fail(function(jqXHR, textStatus, error) {
                        console.log("Running " + action.name + " action failed. Error: " + error);
                        show_error("Running " + action.name + " action failed");
                        throw error;
                    });
                });
                sensor_action_block.append(action_button);
            });
            sensor_block.append(sensor_action_block);
        }
        sensor_widget.append(sensor_block);

        // Refresh sensor value each second
        let sensor_data = [];
        let timer_id = new Timer(function() {
            $.ajax({method: "GET",
                    url: API_ROOT + API_DEVICES + '/' + device_id + API_SENSORS + '/' + sensor.id})
                .done(function(data) {
                    /*  Assume that JSON data format is:
                        {"value": 35}
                    */
                    let value_data = parse_data(data);
                    if ('value' in value_data) {
                        sensor_data.push(value_data.value);
                        if (sensor_data.length > SENSOR_DATA_LENGTH) {
                            sensor_data.shift();
                        }
                    } else {
                        show_error('Getting "' + sensor.name + '" sensor value failed');
                    }

                    // Update chart data
                    let chart_data = [];
                    for (var i = 0; i < sensor_data.length; i++) {
                        chart_data.push({x: i, y: sensor_data[i]});
                    }
                    // Create chart for every sensors. Without recreating it does not want to work :(
                    let chart = new CanvasJS.Chart('chart_' + device_id + '_' + sensor.id, {
                        title :{text: sensor.name, fontFamily: 'sans-serif', fontSize: 20},
                        height: 150,
                        axisY: {includeZero: false},
                        axisX:{labelFormatter: function(e) {return "";}},
                        data: [{type: "line", dataPoints: chart_data}]
                    });
                    chart.render();
                })
                .fail(function(jqXHR, textStatus, error) {
                    console.log("Device list loading failed. Error: " + error);
                    show_error('Device list loading failed');
                    throw error;
                });
        }, 1000);
        sensors.push({timer: timer_id, data: sensor_data});
    });
    // If some tab was already active, will stop sensor refreshing and crete new Device with timers
    if (active_device) {
        active_device.stop_refreshing();
    }
    active_device = new Device(device_id, sensors);
    active_device.start_refreshing();
}


let create_action_widget = function(device_id, device_body, data) {
    /*  Create action widget with buttons that will send request on click event.
        If action is successfully completed, it will show success dialog.
        Otherwise it will show error dialog.
        Assume that JSON data format is:
           [
               {"id": "555", "name": "Turn ON"},
               {"id": "556", "name": "Turn OFF"},
               {"id": "557", "name": "Reboot"}
           ]
    */
    let actions_data = parse_data(data);
    let action_widget = device_body.find('div[name="actions"]');
    if (!action_widget.length) {
        show_error('Action list loading failed');
        throw 'Action list loading failed';
    }
    action_widget.empty();
    action_widget.append($("<label>", {text: "Actions:"}));
    actions_data.forEach(function(action, i, arr) {
        let action_button = $("<button>", {class: 'action',
                                           text: action.name});
        action_button.on('click', function() {
            $.ajax({method: "GET",
                url: API_ROOT + API_DEVICES + '/' + device_id + API_ACTIONS + '/' + action.id})
            .done(function(data) {
                /*  Assume that JSON data format is:
                        {"res": "OK"} or {"res": "Failed due to function is not implemented"}
                */
                let res_data = parse_data(data);
                if (res_data.res == 'OK') {
                    show_success('"' + action.name + '" action successfully executed');
                } else {
                    show_error('"' + action.name + '" action failed. ' + res_data.res);
                }
            })
            .fail(function(jqXHR, textStatus, error) {
                console.log("Running " + action.name + " action failed. Error: " + error);
                show_error("Running " + action.name + " action failed");
                throw error;
            });
        });
        action_widget.append(action_button);
    });
}


function get_device_info(event, ui) {
    /*  Get full device info from server. It contains information about sensors and actions  */
    let device_id = $(ui.newTab).attr('id');
    let device_body = $($(ui.newTab).children('a').attr('href'));
    console.log('Getting ' + device_id + ' device info');

    $.ajax({method: "GET",
            url: API_ROOT + API_DEVICES + '/' + device_id + API_SENSORS})
        .done(function(data) {
            create_sensor_widget(device_id, device_body, data);
        })
        .fail(function(jqXHR, textStatus, error) {
            console.log("Sensor list loading failed. Error: " + error);
            show_error('Sensor list loading failed');
            throw error;
        });

    $.ajax({method: "GET",
            url: API_ROOT + API_DEVICES + '/' + device_id + API_ACTIONS})
        .done(function(data) {
            create_action_widget(device_id, device_body, data);
        })
        .fail(function(jqXHR, textStatus, error) {
            console.log("Action list loading failed. Error: " + error);
            show_error('Action list loading failed');
            throw error;
        });
}


/******************************************************  Main  ********************************************************/

$(function() {
    $("#device_list").tabs({activate: get_device_info})
                     .addClass("ui-tabs-vertical ui-helper-clearfix");
    get_device_list();
});

/**********************************************************************************************************************/
