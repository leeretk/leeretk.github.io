(function (jquery) {
    //Declare Namespaces
    window.SNET = window.SNET || {};
    SNET.Landing = SNET.Landing || {};
    SNET.Landing.Functions = SNET.Landing.Functions || {};
    SNET.Landing.Variables = SNET.Landing.Variables || {};

    //Declare Variables
    SNET.Landing.Variables.linksList = "HomePageLinks";
    SNET.Landing.Variables.notificationsList = "Notifications";
    SNET.Landing.Variables.rotater = {
        "elemClass": "snetBanner",
        "currentItem": 0,
        "delay": 10
    };

    //Declare Functions

    //Initialization function
    SNET.Landing.Functions.init = function () {
        jquery("#tabs").tabs();

        SNET.Landing.Functions.getMyRequests();
        SNET.Landing.Functions.getMyTasks();
        SNET.Landing.Functions.getNotifications();
        SNET.Landing.Functions.getLinks();

        jquery(".snetLoading").hide();
        jquery("#tabs").fadeIn();
    };

    /** SECTION: My Tasks */

    SNET.Landing.Functions.getMyTasks = function () {
        SNET.Landing.Functions.getMyTasksParams().done(function (data) {
            var myObjs = JSON.parse(data);
            var listCount = myObjs.tasks.length;
            var i = 0;

            for (i; i < listCount; i++) {
                SNET.Landing.Functions.getMyTasksData(myObjs.tasks[i]);
            }
        })
    }

    SNET.Landing.Functions.getMyTasksParams = function () {
        var myTasksDataUrl = String.format("{0}/SiteCustomizations/Landing.MyTasks.txt", _spPageContextInfo.webAbsoluteUrl);

        return jquery.ajax({
            url: myTasksDataUrl,
            type: "GET"
        });
    };

    SNET.Landing.Functions.getMyTasksData = function (taskObj) {
        var url = String.format("{0}/_api/web/lists/getbytitle('{1}')/getitems?$expand=FieldValuesAsText&$select={2}",
            _spPageContextInfo.webAbsoluteUrl,
            taskObj.name,
            taskObj.fields.join(","));
        var requestData = {
            query: {
                __metadata: {
                    'type': 'SP.CamlQuery'
                },
                ViewXml: taskObj.caml
            }
        };

        jquery.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(requestData),
            headers: {
                "X-RequestDigest": jquery("#__REQUESTDIGEST").val(),
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose"
            }
        }).done(function (data) {
            if (data.d.results.length > 0) {
                var mappedResults = SNET.Landing.Functions.mapData(taskObj.mapping, data.d.results, "FieldValuesAsText");
                var groupedResults = {};
                if (taskObj.groups) {
                    groupedResults = SNET.Landing.Functions.groupMyTasksData(taskObj, mappedResults);
                    for (var group in groupedResults) {
                        groupedResults[group].map(function (item) {
                            if (!item.DispForm) {
                                item.DispForm = String.format(taskObj.displayForm, taskObj.listId, item.ID, encodeURIComponent(window.location.href));
                            }

                            if (!item.EditForm) {
                                item.EditForm = String.format(taskObj.editForm, taskObj.listId, item.ID, encodeURIComponent(window.location.href));
                            }
                            return item;
                        });
                    }
                } else {
                    groupedResults[taskObj.title] = [];
                    mappedResults.forEach(function (result) {
                        groupedResults[taskObj.title].push(result);
                    });
                    groupedResults[taskObj.title].map(function (item) {
                        if (!item.DispForm) {
                            item.DispForm = String.format(taskObj.displayForm, taskObj.listId, item.ID, encodeURIComponent(window.location.href));
                        }

                        if (!item.EditForm) {
                            item.EditForm = String.format(taskObj.editForm, taskObj.listId, item.ID, encodeURIComponent(window.location.href));
                        }
                        return item;
                    });
                }
                SNET.Landing.Functions.renderMyTasks(groupedResults);
            }
        }).fail(SNET.Landing.Functions.logError);
    };

    SNET.Landing.Functions.groupMyTasksData = function (taskObj, results) {
        var groups = taskObj.groups;
        var groupedResults = {};
        groups.forEach(function (group) {
            groupedResults[group.title] = [];
            var fn = SNET.Landing.Functions[group.PostFilterFn];
            results = typeof fn === 'function' ? results.filter(fn) : results;

            results.forEach(function (result) {
                if (result.WorkflowName.indexOf(group.WorkflowNameFilter) > -1) {
                    groupedResults[group.title].push(result);
                }
            });
        });
        return groupedResults;
    };

    SNET.Landing.Functions.renderMyTasks = function (data) {
        if (data) {
            for (var key in data) {
                if (data[key].length > 0) {
                    var results = data[key].sort(function (obj1, obj2) {
                        var obj1rel = Number(obj1.RelatedContentLink.split(",")[1].trim());
                        var obj2rel = Number(obj2.RelatedContentLink.split(",")[1].trim());
                        return obj1rel - obj2rel;
                    });
                    var docFrag = document.createDocumentFragment();
                    var section = document.createElement("section");
                    section.className = "snetMyRequests";

                    var header = document.createElement("header");
                    header.className = "snetCollapsed";
                    header.innerHTML = String.format("{0} ({1})", key, results.length);
                    header.onclick = function (e) {
                        jquery(this).toggleClass("snetExpanded");
                        jquery(this).toggleClass("snetCollapsed")
                        jquery(this).next().toggleClass("snetExpand");
                        jquery(this).next().toggleClass("snetCollapse");
                    }
                    section.appendChild(header);
                    for (var i = 0; i < results.length; i++) {
                        console.log(results[i]);
                        var table = document.createElement("table");
                        table.className = "snetCollapse";
                        var htmlArr = [
                            "<thead><tr>",
                            "<th></th>",
                            "<th>Title</th>",
                            "<th>Assigned To</th>",
                            "<th>Related Content</th>",
                            "</tr></thead>",
                            "<tbody>"
                        ];
                        for (var i = 0; i < results.length; i++) {
                            var dispLink = String.format("<a href='{0}'>{1}</a>", results[i].DispForm, results[i].Title);
                            var editLink = String.format("<a href='{0}'><img alt='edit' style='padding-top:25%' src='/_layouts/15/images/edititem.gif?rev=23' border='0'></a>", results[i].EditForm);
                            var relatedContent = results[i].RelatedContentLink.split(",");
                            var relatedContentLink = String.format("<a href='{0}'>{1}</a>", relatedContent[0].trim(), relatedContent[1].trim());
                            htmlArr.push("<tr>");
                            htmlArr.push(String.format("<td style='width:4%'>{0}</td>", editLink));
                            htmlArr.push(String.format("<td style='width:55%; padding-right: 15px;'>{0}</td>", dispLink));
                            htmlArr.push(String.format("<td style='width:20%;padding-right: 15px;'>{0}</td>", results[i].AssignedTo));
                            htmlArr.push(String.format("<td>{0}</td>", relatedContentLink));
                            htmlArr.push("</tr>");
                        }
                        htmlArr.push("</tbody>");
                        table.innerHTML = htmlArr.join("");
                        section.appendChild(table);
                    }
                    docFrag.appendChild(section);

                    document.getElementById("MyTasks").appendChild(docFrag);
                }
            }
        }
    };

    SNET.Landing.Functions.filterIDEAR = function (item) {
        return item.Title.indexOf("Task: On Hold") === -1;
    };

    SNET.Landing.Functions.filterSAR = function (item) {
        var created = new Date(item.Created);
        var minDate = new Date("12/31/2017");
        return created > minDate;
    }

    /** END SECTION: My Tasks */

    /** SECTION: My Requests */

    SNET.Landing.Functions.filterCompleteNprs = function (obj) {
        return obj.Status_x0020_NPstatus0.toLowerCase().indexOf("complete") === -1;
    };

    SNET.Landing.Functions.getMyRequests = function () {
        SNET.Landing.Functions.getMyRequestParams().done(function (data) {
            var myObjs = JSON.parse(data);
            var listCount = myObjs.lists.length;
            var i = 0;

            for (i; i < listCount; i++) {
                SNET.Landing.Functions.getMyRequestData(myObjs.lists[i]);
            }
        });
    }

    SNET.Landing.Functions.getMyRequestParams = function () {
        var myRequestsDataUrl = String.format("{0}/SiteCustomizations/Landing.MyRequests.txt", _spPageContextInfo.webAbsoluteUrl);

        return jquery.ajax({
            url: myRequestsDataUrl,
            type: "GET"
        });
    };

    SNET.Landing.Functions.getMyRequestData = function (obj) {
        var filters = String.format(obj.filter, _spPageContextInfo.userId);
        var url = String.format("{0}/_api/web/lists/getbytitle('{1}')/items?$select={2}&$filter={3}",
            _spPageContextInfo.webAbsoluteUrl,
            obj.name,
            obj.fields.join(","),
            filters);

        jquery.ajax({
            url: url,
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).done(function (data) {
            if (data.d.results.length > 0) {
                var fn = SNET.Landing.Functions[obj.postLoadFilter];
                var results = typeof fn === 'function' ? data.d.results.filter(fn) : data.d.results;
                if (results.length > 0) {
                    var mappedResults = SNET.Landing.Functions.mapData(obj.mapping, results);

                    mappedResults = mappedResults.map(function (item) {
                        if (!item.DispForm) {
                            item.DispForm = String.format(obj.displayForm, item.ID, encodeURIComponent(window.location.href));
                        } else {
                            //InfoPath
                            item.DispForm = String.format("/department/Finance/SupplyNET/_layouts/15/FormServer.aspx?XmlLocation={0}&Source={1}", item.DispForm, encodeURIComponent(window.location.href));
                        }

                        if (obj.editForm) {
                            item.EditForm = String.format(obj.editForm, item.ID, encodeURIComponent(window.location.href));
                        }

                        return item;
                    });

                    SNET.Landing.Functions.renderMyRequest(obj.name, mappedResults)
                }
            }
        }).fail(SNET.Landing.Functions.logError);
    };

    SNET.Landing.Functions.renderMyRequest = function (title, data) {
        var docFrag = document.createDocumentFragment();
        var section = document.createElement("section");
        section.className = "snetMyRequests";

        var header = document.createElement("header");
        header.className = "snetCollapsed";
        header.innerHTML = String.format("{0} ({1})", title, data.length);
        header.onclick = function (e) {
            jquery(this).toggleClass("snetExpanded");
            jquery(this).toggleClass("snetCollapsed")
            jquery(this).next().toggleClass("snetExpand");
            jquery(this).next().toggleClass("snetCollapse");
        }
        section.appendChild(header);

        var table = document.createElement("table");
        table.className = "snetCollapse";
        var htmlArr = [
            "<thead><tr>",
            "<th>ID</th>",
            "<th></th>",
            "<th>Title</th>",
            "<th>Status</th>",
            "</tr></thead>",
            "<tbody>"
        ];

        for (var i = 0; i < data.length; i++) {
            var dispLink = String.format("<a href='{0}'>{1}</a>", data[i].DispForm, data[i].Title);

            htmlArr.push("<tr>");
            if (data[i].EditForm) {
                var editLink = String.format("<a href='{0}'><img alt='edit' style='padding-top:25%' src='/_layouts/15/images/edititem.gif?rev=23' border='0'></a>", data[i].EditForm);
                htmlArr.push(String.format("<td style='width:7%'>{0}</td>", data[i].ID));
                htmlArr.push(String.format("<td style='width:4%'>{0}</td>", editLink));
            } else {
                htmlArr.push(String.format("<td style='width:11%;' colspan=2>{0}</td>", data[i].ID));
            }

            htmlArr.push(String.format("<td style='width:50%; padding-right: 15px;'>{0}</td>", dispLink));
            htmlArr.push(String.format("<td>{0}</td>", data[i].Status));
            htmlArr.push("</tr>");
        }
        htmlArr.push("</tbody>");
        table.innerHTML = htmlArr.join("");
        section.appendChild(table);
        docFrag.appendChild(section);

        document.getElementById("MyRequests").appendChild(docFrag);
    };

    /** END SECTION: My Requests */

    /** SECTION: Links */

    SNET.Landing.Functions.getLinks = function () {
        jquery.ajax({
            url: String.format("{0}/_api/web/lists/getbytitle('{1}')/items?$select=Title,Url,ScmVertical,Category,SortOrder&$filter=Enabled eq 1", _spPageContextInfo.webAbsoluteUrl, SNET.Landing.Variables.linksList),
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).then(SNET.Landing.Functions.renderLinks, SNET.Landing.Functions.logError);
    };

    //Group verticals and categories for rendering display
    SNET.Landing.Functions.groupResults = function (results) {
        var groupByVertical = SNET.Common.Functions.groupBy("ScmVertical");
        var groupByCategory = SNET.Common.Functions.groupBy("Category");
        var groupedByVertical = groupByVertical(results);
        var groups = {};

        for (var vertical in groupedByVertical) {
            var groupedByCategory = groupByCategory(groupedByVertical[vertical]);

            for (var category in groupedByCategory) {
                groupedByCategory[category].sort(function (a, b) {
                    if (a.SortOrder < b.SortOrder) return -1;
                    if (a.SortOrder > b.SortOrder) return 1;
                    return 0;
                });
            }
            groups[vertical.replace(" ", "")] = groupedByCategory;
        }
        return groups;
    };

    SNET.Landing.Functions.renderLinks = function (data) {
        var verticals = SNET.Landing.Functions.groupResults(data.d.results);

        for (var vertical in verticals) {
            var docFrag = document.createDocumentFragment();
            var categories = verticals[vertical];
            for (var category in categories) {
                var div = document.createElement("div");
                div.className = "snetGroup";

                var header = document.createElement("header");
                header.innerHTML = String.format("<span>{0}</span>", category);
                div.appendChild(header);

                for (var i = 0; i < categories[category].length; i++) {
                    var section = document.createElement("section");
                    var link = document.createElement("a");
                    link.href = categories[category][i].Url;
                    link.innerHTML = categories[category][i].Title;
                    section.appendChild(link);
                    div.appendChild(section);
                }
                docFrag.appendChild(div);
            }
            document.getElementById(vertical).appendChild(docFrag);
        }
    };

    /** END SECTION: Links */

    /** SECTION: Notifications */

    SNET.Landing.Functions.getNotifications = function () {
        var currentDateTime = new Date();
        var isoCurrentDateTime = currentDateTime.toISOString();

        jquery.ajax({
            url: String.format("{0}/_api/web/lists/getbytitle('{1}')/items?$orderby=Importance&$filter=StartDateTime le datetime'{2}' and EndDateTime ge datetime'{3}'", _spPageContextInfo.webAbsoluteUrl, SNET.Landing.Variables.notificationsList, isoCurrentDateTime, isoCurrentDateTime),
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).then(SNET.Landing.Functions.renderNotifications, SNET.Landing.Functions.logError);
    };

    SNET.Landing.Functions.renderNotifications = function (data) {
        var currentDateTime = new Date();
        SNET.Landing.Variables.rotater.lastUpdate = currentDateTime;
        SNET.Landing.Variables.rotater.data = [];

        if (data.d.results.length > 0) {
            var results = data.d.results;
            for (var i = 0; i < results.length; i++) {
                var className = "snetAlert";
                var href = String.format("{0}/Lists/{1}/DispForm.aspx?ID={2}&Source={3}", _spPageContextInfo.webAbsoluteUrl, SNET.Landing.Variables.notificationsList, results[i].Id, encodeURIComponent(window.location.href));
                switch (results[i].Importance) {
                    case "3":
                        className += " snetInfo";
                        break;
                    case "2":
                        className += " snetNotice";
                        break;
                    case "1":
                        className += " snetImportant";
                        break;
                };

                SNET.Landing.Variables.rotater.data.push(String.format("<a class='{0}' href='{1}'>{2}. Click for more details...</a>", className, href, results[i].Title));
            }
            SNET.Landing.Functions.rotater();
        }
    };

    //Load and manage alert banner
    SNET.Landing.Functions.rotater = function () {
        jquery(String.format(".{0}", SNET.Landing.Variables.rotater.elemClass)).html(SNET.Landing.Variables.rotater.data[SNET.Landing.Variables.rotater.currentItem]);
        SNET.Landing.Variables.rotater.currentItem = (SNET.Landing.Variables.rotater.currentItem == SNET.Landing.Variables.rotater.data.length - 1) ? 0 : SNET.Landing.Variables.rotater.currentItem + 1;
        setTimeout(SNET.Landing.Functions.rotater, SNET.Landing.Variables.rotater.delay * 1000);
    };

    /** END SECTION: Notifications */

    /** SECTION: Utilities */

    SNET.Landing.Functions.logError = function (jqXHR, status, error) {
        console.log(jqXHR);
    };

    SNET.Landing.Functions.mapData = function (mapping, results, subObj) {
        var keys = Object.getOwnPropertyNames(mapping);
        return newResults = results.map(function (item) {
            var newItem = {};
            for (var key in keys) {
                if (subObj) {
                    newItem[keys[key]] = item[subObj][mapping[keys[key]]];
                } else {
                    newItem[keys[key]] = item[mapping[keys[key]]];
                }
            }
            return newItem;
        });
    };

    /** END SECTION: Utilities */

    SNET.Landing.Functions.init();
})($);