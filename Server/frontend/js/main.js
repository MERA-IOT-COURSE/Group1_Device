
const API_ROOT = '<API URL>';
const API_DEVICES = '/devices';
const API_SENSORS = '/sensors';
const API_ACTIONS = '/actions';
var devices = [];

/**********************************************  Test ajax function  **************************************************/
// TODO: Remove it, when testing is done
//       This function replaces ajax function to test client code without web server
$.ajax = function(data) {
    if (data.url == API_ROOT + API_DEVICES) {
        var res_data = '[{"id": "123", "name": "Dev1"},{"id": "456", "name": "Dev2"}]';
    } else if (data.url == API_ROOT + API_DEVICES + '/' + '123' + API_SENSORS ||
               data.url == API_ROOT + API_DEVICES + '/' + '456' + API_SENSORS) {
        var res_data = '[{"id": "222", "name": "Temperature"},{"id": "223", "name": "Humidity"},{"id": "224", "name": "SomeSensor"}]';
    } else if (data.url == API_ROOT + API_DEVICES + '/' + '123' + API_ACTIONS ||
               data.url == API_ROOT + API_DEVICES + '/' + '456' + API_ACTIONS) {
        var res_data = '[{"id": "555", "name": "Turn ON"},{"id": "556", "name": "Turn OFF"},{"id": "557", "name": "Reboot"}]';
    } else if (data.url == API_ROOT + API_DEVICES + '/' + '123' + API_ACTIONS + '/' + '555' ||
               data.url == API_ROOT + API_DEVICES + '/' + '123' + API_ACTIONS + '/' + '556') {
        var res_data = '{"res": "OK"}';
    } else if (data.url == API_ROOT + API_DEVICES + '/' + '123' + API_ACTIONS + '/' + '557') {
        var res_data = '{"res": "Fail. Reboot is not implemented"}';
    } else if (data.url == API_ROOT + API_DEVICES + '/' + '123' + API_SENSORS + '/' + '222' ||
               data.url == API_ROOT + API_DEVICES + '/' + '123' + API_SENSORS + '/' + '223' ||
               data.url == API_ROOT + API_DEVICES + '/' + '123' + API_SENSORS + '/' + '224') {
        let max = 100
        let min = 0
        let v = Math.floor(Math.random() * (max - min + 1)) + min
        var res_data = '{"value": ' + v + '}';
    } else {
        throw "No TEST function for URL: " + data.url;
    }

    let res = {done: function(func) { func(res_data); return res; },
               fail: function(func) { return res; } }
    return res
}

/**********************************************  Test ajax function  **************************************************/


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
    $('<div>', {name: 'actions'}).appendTo(device_body);
    $('<div>', {name: 'sensors'}).appendTo(device_body);
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
    devices_data.forEach(function(item, i, arr) {
        try {
            add_device_tab(device_tabs, item.id, item.name);
        } catch (e) {
            console.log('Adding device failed. Error: ' + e);
            show_error('Adding "' + item + '" device failed');
            throw e;
        }
    });
    // Refresh tabs to css be applied to them
    device_tabs.tabs("refresh");
    // Trigger the first device tab activation
    device_tabs.tabs("option", "active", 0);
}


function get_device_list() {
    /*  Get device list from server  */
    $.ajax({method: "POST",
            url: API_ROOT + API_DEVICES})
        .done(create_device_widget)
        .fail(function(jqXHR, textStatus, error) {
            console.log("Device list loading failed. Error: " + error);
            show_error('Device list loading failed');
            throw e;
        });
}


let create_sensor_widget = function(device_id, device_body, data) {
    /*
        Assume that JSON data format is:
           [
               {"id": "222", "name": "Temperature"},
               {"id": "223", "name": "Humidity"}
           ]
    */
    let sensors_data = parse_data(data);
    let sensor_widget = device_body.find('div[name="sensors"]');
    if (!sensor_widget.length) {
        show_error('Sensor list loading failed');
        throw 'Sensor list loading failed';
    }
    sensor_widget.empty();
    sensors_data.forEach(function(item, i, arr) {
        let sensor_block = $("<div>", {class: 'sensor-block'});
        let sensor_name = $("<label>", {class: 'sensor-name',
                                        text: item.name});
        let sensor_value =  $("<input>", {type: 'text',
                                          class: 'sensor-value',
                                          id: device_id + '_' + item.id});
        sensor_block.append(sensor_name)
                    .append(sensor_value);
        sensor_widget.append(sensor_block);

        // TODO: This timer will be used to stop refreshing
        // Refresh sensor value each second
        var timerId = setInterval(function() {
            $.ajax({method: "POST",
                    url: API_ROOT + API_DEVICES + '/' + device_id + API_SENSORS + '/' + item.id})
                .done(function(data) {
                    /*  Assume that JSON data format is:
                        {"value": 35}
                    */
                    let value_data = parse_data(data);
                    if ('value' in value_data) {
                        console.log('CHANGE!');
                        sensor_value.val(value_data.value);
                    } else {
                        show_error('Getting "' + item.name + '" sensor value failed');
                    }
                })
                .fail(function(jqXHR, textStatus, error) {
                    console.log("Device list loading failed. Error: " + error);
                    show_error('Device list loading failed');
                    throw e;
                });
        }, 1000);
    });
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
    actions_data.forEach(function(item, i, arr) {
        let action_button = $("<button>", {class: 'action',
                                           text: item.name});
        action_button.on('click', function() {
            $.ajax({method: "POST",
                url: API_ROOT + API_DEVICES + '/' + device_id + API_ACTIONS + '/' + item.id})
            .done(function(data) {
                /*  Assume that JSON data format is:
                        {"res": "OK"} or {"res": "Failed due to function is not implemented"}
                */
                let res_data = parse_data(data);
                if (res_data.res == 'OK') {
                    show_success('"' + item.name + '" action successfully executed');
                } else {
                    show_error('"' + item.name + '" action failed. ' + res_data.res);
                }
            })
            .fail(function(jqXHR, textStatus, error) {
                console.log("Sensor list loading failed. Error: " + error);
                show_error('Sensor list loading failed');
                throw e;
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

    $.ajax({method: "POST",
            url: API_ROOT + API_DEVICES + '/' + device_id + API_SENSORS})
        .done(function(data) {
            create_sensor_widget(device_id, device_body, data);
        })
        .fail(function(jqXHR, textStatus, error) {
            console.log("Sensor list loading failed. Error: " + error);
            show_error('Sensor list loading failed');
            throw e;
        });

    $.ajax({method: "POST",
            url: API_ROOT + API_DEVICES + '/' + device_id + API_ACTIONS})
        .done(function(data) {
            create_action_widget(device_id, device_body, data);
        })
        .fail(function(jqXHR, textStatus, error) {
            console.log("Action list loading failed. Error: " + error);
            show_error('Action list loading failed');
            throw e;
        });
}


/******************************************************  Main  ********************************************************/

$(function() {
    $("#device_list").tabs({activate: get_device_info}).addClass("ui-tabs-vertical ui-helper-clearfix");
    $("#device_list li").removeClass("ui-corner-top").addClass("ui-corner-left");
    get_device_list();
});

/**********************************************************************************************************************/
