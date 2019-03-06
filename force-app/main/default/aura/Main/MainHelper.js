({
    getSensorRecords: function (component, event, helper, value, pageSize, pageNumber) {
        var action = component.get("c.getDataFile");

        action.setParams({
            "ListId": value,
            "pageLimit": pageSize,
            "pageNumber": pageNumber
        });

        action.setCallback(this, function (response) {
            var state = response.getState();

            if (state === "SUCCESS") {
                var obj = response.getReturnValue();
                component.set("v.sensorList", obj.sensors);
                component.set("v.totalPages", Math.ceil(obj.totalPages / pageSize));
                component.set("v.currentPage", obj.page);
                var previous = component.find("Previous");

                var next = component.find("Next");
                var first = component.find("First");
                var last = component.find("Last");
                if (component.get("v.currentPage") === 1 && component.get("v.totalPages") === 1) {
                    previous.set("v.disabled", true);
                    next.set("v.disabled", true);
                    last.set("v.disabled", true);
                    first.set("v.disabled", true);
                }
                else if (component.get("v.currentPage") === component.get("v.totalPages")) {
                    next.set("v.disabled", true);
                    last.set("v.disabled", true);
                    previous.set("v.disabled", false);
                    first.set("v.disabled", false);

                } else if (component.get("v.currentPage") === 1) {
                    previous.set("v.disabled", true);
                    first.set("v.disabled", true);
                    next.set("v.disabled", false);
                    last.set("v.disabled", false);
                } else {
                    previous.set("v.disabled", false);
                    next.set("v.disabled", false);
                    last.set("v.disabled", false);
                    first.set("v.disabled", false);

                }

            } else {
                console.log('getRecordsError');
            }
        });
        window.setTimeout(
            $A.getCallback(function () { $A.enqueueAction(action) }),
            50
        );
    },

    deleteSelectedRecords: function (component, event, helper, ListId) {

        var action = component.get("c.deleteSensors");
        action.setParams({ "recordsToDelete": ListId });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var values = this.different(component.get("v.tempArr"), response.getReturnValue());
                var pageNumber = component.get("v.currentPage");
                pageNumber = component.get("v.selectedCheckbox") == component.find("InputSelectSingle").get("v.value") ? pageNumber -= 1 : pageNumber;
                var pageSize = component.find("InputSelectSingle").get("v.value");
                component.set("v.selectedCheckbox", 0);
                this.getSensorRecords(component, event, helper, values, pageSize, pageNumber);
            } else {
                console.log("deleteRecordsError");
            }

        });
        $A.enqueueAction(action);
    },
    different: function (arr1, arr2) {
        var result = [];
        arr1.forEach(function (el) {
            if (arr2.indexOf(el) == -1)
                result.push(el);

        });
        return result;

    }

})