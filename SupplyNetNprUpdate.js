(function (jquery) {
    var SNET = SNET || {};
    SNET.common = SNET.common || {};
    SNET.common.Functions = SNET.common.Functions || {};
    SNET.common.Variables = SNET.common.Variables || {};


    /**
     * Description: Create a new cookie for the site
     *
     * @param {string} name The name of the cookie
     * @param {object} value The value of the cookie. Can be simple types or a json object
     * @param {int} exDays The number of days until the cookie expires. Default is 7
     */
    SNET.common.Functions.BakeCookie = function (name, value, exDays) {
        exDays = exDays ? exDays : 7;
        var d = new Date();
        d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();

        var cookie = [name, '=', JSON.stringify(value), ';' + expires + '; domain=.', window.location.host.toString(), '; path=/;'].join('');
        document.cookie = cookie;
    }

    /**
     * Description: Retrieve a cookie from the jar
     *
     * @param {string} name The name of the cookie
     */
    SNET.common.Functions.TakeCookie = function (name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }

    /**
     * Description: Delete a cookie from the jar
     *
     * @param {string} name The name of the cookie
     */
    SNET.common.Functions.DeleteCookie = function (name) {
        document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
    }

    SNET.common.Functions.GetParamByName = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    /**
     * Description: Check if the current SharePoint user is a member of the specified group
     *
     * @param {string} groupName The name of the group
     * @param {function} OnComplete The function to run when IsCurrentUserInGroup completes. Requires a single boolean parameter.
     */
    SNET.common.Functions.IsCurrentUserInGroup = function (groupName, OnComplete) {
        var ctx = new SP.ClientContext.get_current();
        var web = ctx.get_web();

        var currentUser = web.get_currentUser();
        ctx.load(currentUser);

        var allGroups = web.get_siteGroups();
        ctx.load(allGroups);

        var group = allGroups.getByName(groupName);
        ctx.load(group);

        var groupUsers = group.get_users();
        ctx.load(groupUsers);

        ctx.executeQueryAsync(OnSuccess, OnFailure);

        function OnSuccess(sender, args) {
            var userInGroup = false;
            var groupUserEnum = groupUsers.getEnumerator();
            while (groupUserEnum.moveNext()) {
                var groupUser = groupUserEnum.get_current();
                if (groupUser.get_id() == currentUser.get_id()) {
                    userInGroup = true;
                    break
                }
            }
            OnComplete(userInGroup);
        }

        function OnFailure(sender, args) {
            OnComplete(false);
        }
    }

    /**
     * Description: Check if the current sharepoint user has already seen the NPR Tipsheet
     * 
     * * @param {function} OnComplete The function to run when TipSheetReviewed completes. Requires a single boolean parameter.
     */
    function TipSheetReviewed(OnComplete) {
        var test = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('zNPRAck')/items?$filter=Title eq '" + _spPageContextInfo.userId.toString() + "'";
        jquery.ajax({
            url: test,
            headers: {
                "accept": "application/json;odata=verbose"
            }
        }).done(function (data) {
            if (data.d.results.length > 0) {
                OnComplete(true);
            } else {
                OnComplete(false);
            }
        }).fail(function (jqXHR, textStatus, errorMessage) {
            OnComplete(false);
        });
    }

    function SnetCheckUserNew() {
        var canAccess = false;

        TipSheetReviewed(function (didReview) {
            canAccess = didReview;

            if(!canAccess) {
                setTimeout(function () {
                    var aQueries = ["a[href*='NewProductRequest'", "a[href*='NPR_Search'", "a[href*='NPR_VAM_Tasks'"]
                    var vQueries = ["option[value*='NewProductRequest'"];

                    var newUrl = "/department/Finance/SupplyNET/SitePages/NPR_TipSheet.aspx";
                    var nprLinks;

                    for (var i = 0; i < aQueries.length; i++) {
                        nprLinks = document.querySelectorAll(aQueries[i]);
                        for (var j = 0; j < nprLinks.length; j++) {
                            nprLinks[j].href = newUrl + "?nextPage=" + encodeURIComponent(nprLinks[j].href);
                        }
                    }

                    for (var i = 0; i < vQueries.length; i++) {
                        nprLinks = document.querySelectorAll(vQueries[i]);
                        for (var j = 0; j < nprLinks.length; j++) {
                            nprLinks[j].value = newUrl + "?nextPage=" + encodeURIComponent(nprLinks[j].value);
                        }
                    }
                }, 500);
            }
        });
    }

    function SnetCheckUser() {
        var cookieName = 'snetNpr';
        var cookie = SNET.common.Functions.TakeCookie(cookieName);
        if (!cookie) {
            SNET.common.Functions.IsCurrentUserInGroup('snet TEMP NPR', function (isInGroup) {
                var cookie = {};
                if (!isInGroup) {
                    cookie.canEditNpr = false;
                } else {
                    cookie.canEditNpr = true;
                }

                SNET.common.Functions.BakeCookie(cookieName, cookie, 3);
                SnetCheckUser();
            });
        } else {
            if (!cookie.canEditNpr) {
                setTimeout(function () {
                    var aQueries = ["a[href*='NewProductRequest'", "a[href*='NPR_Search'", "a[href*='NPR_VAM_Tasks'"]
                    var eQueries = ["a[onclick*='{3EF4450C-21A6-4937-AA65-C755188D8F98}'"];
                    var vQueries = ["option[value*='NewProductRequest'"];

                    var newUrl = "/department/Finance/SupplyNET/SitePages/Under%20Construction.aspx";
                    var nprLinks;

                    for (var i = 0; i < aQueries.length; i++) {
                        nprLinks = document.querySelectorAll(aQueries[i]);
                        for (var j = 0; j < nprLinks.length; j++) {
                            nprLinks[j].href = newUrl + "?nextPage=" + encodeURIComponent(nprLinks[j].href);
                        }
                    }

                    for (var i = 0; i < eQueries.length; i++) {
                        nprLinks = document.querySelectorAll(eQueries[i]);
                        for (var j = 0; j < nprLinks.length; j++) {
                            nprLinks[j].parentNode.parentNode.style.display = 'none';
                        }
                    }

                    for (var i = 0; i < vQueries.length; i++) {
                        nprLinks = document.querySelectorAll(vQueries[i]);
                        for (var j = 0; j < nprLinks.length; j++) {
                            nprLinks[j].value = newUrl + "?nextPage=" + encodeURIComponent(nprLinks[j].href);
                        }
                    }
                }, 500)
            }
        }
    }
    ExecuteOrDelayUntilScriptLoaded(SnetCheckUserNew, 'SP.js');
})($);