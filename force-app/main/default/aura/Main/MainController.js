({
    UploadFile: function (component, event, helper) {

        var files = event.getSource().get("v.files");
        var file = files[0];
        if (!file) {
            alert("Failed to load file");
        } else if (!file.type.match("application/vnd.ms-excel")) {
            alert("Don't support " + file.type + " extension!");
        } else {
            var reader = new FileReader();
            reader.onload = function (e) {
                var content = reader.result.replace(/\n/g, ",").replace(/\r/g, " ");
                var resultArr = content.split(',');
                resultArr.pop();
                var jsonResult = JSON.stringify(resultArr);
                var action = component.get("c.saveDataFile");
                action.setParams({ "file": jsonResult });
                action.setCallback(this, function (response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.set("v.tempArr", action.getReturnValue());
                        var pageSize = component.find("InputSelectSingle").get("v.value");
                        var pageNumber = 1;

                        helper.getSensorRecords(component, event, helper, action.getReturnValue(), pageSize, pageNumber);
                    } else {
                        console.log('qwer1');
                    }
                });
                window.setTimeout(
                    $A.getCallback(function () { $A.enqueueAction(action) }),
                    50
                );
            }
            reader.readAsText(file);
        }
    },

    setPageNumber: function (component, event, helper) {
        var label = event.getSource().get("v.label");
        var pageNumber = component.get("v.currentPage");
        var pageSize = component.find("InputSelectSingle").get("v.value");
        var sensors = component.get("v.tempArr");
        switch (label) {
            case "Next": pageNumber += 1; break;
            case "Previous": pageNumber -= 1; break;
            case "First": pageNumber = 1; break;
            case "Last": pageNumber = component.get("v.totalPages"); break;

        }

        helper.getSensorRecords(component, event, helper, sensors, pageSize, pageNumber);


    },
    onSingleSelectChange: function (component, event, helper) {
        var sensors = component.get("v.tempArr");
        if (sensors.length > 0) {
            var pageNumber = 1;
            var pageSize = component.find("InputSelectSingle").get("v.value");
            helper.getSensorRecords(component, event, helper, sensors, pageSize, pageNumber);
        }

    },

    selectCheckbox: function (component, event, helper) {
        var items = component.get("v.selectedCheckbox");
        var e = event.getSource().get("v.value");
        items = e == true ? items += 1 : items -= 1;

        component.set("v.selectedCheckbox", items);
    },
    deleteRecords: function (component, event, helper) {
        var selectedRecords = component.find("checkID");
        var ListId = [];
        selectedRecords.forEach(function (item) {
            if (item.get("v.value") == true) {
                ListId.push(item.get("v.text"));
            }
            return ListId;
        });


        helper.deleteSelectedRecords(component, event, helper, ListId);

    }

})