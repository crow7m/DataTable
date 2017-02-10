$(window, document, undefined).ready(function () {


    var $ripples = $('.ripples');

    $ripples.on('click.Ripples', function (e) {

        var $this = $(this);
        var $offset = $this.parent().offset();
        var $circle = $this.find('.ripplesCircle');

        var x = e.pageX - $offset.left;
        var y = e.pageY - $offset.top;

        $circle.css({
            top: y + 'px',
            left: x + 'px'
        });

        $this.addClass('is-active');

    });

    $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function (e) {
        $(this).removeClass('is-active');
    });
// Login checking username and password setting obj to local storage if not set
    var person = {name: "admin", password: "12345"};
    if (localStorage.getItem("tableJson") === null) {
        $.ajax({
            url: 'http://localhost/table/js/data',
            type: 'POST',
            processData: false,
            contentType: false,
            cache: true,
            success: function SetLocal(data) {
                localStorage.setItem("tableJson", data);

            },
            error: function (e) {
                console.log('Error!', e);
            }
        });

    }
// Onclick check the username and pass, show the page and hide the form
    $('#submit_button').click(function () {
        var name_value = $("#name").val();
        var pass_value = $("#password").val();
        if (name_value == person.name && pass_value == person.password) {
            $("#login").fadeOut("slow", function () {
                $("#NotVisibleContainer").removeClass("hidden");
                $("#SaveButton").removeClass("hidden");
                $("body").removeClass("background");
                var updated = jQuery.parseJSON(localStorage.getItem("tableJson"));

                //  Building table and populating with data from var updated.

                $('#table2').bootstrapTable({
                    "bStateSave": true,
                    "defaultContent": "",
                    columns: [


                        {
                            field: 'string'

                        },

                        {
                            field: 'string1'

                        },
                        {
                            field: 'string2'

                        },
                        {
                            field: 'string3'

                        },
                        {
                            field: 'string4'

                        },
                        {
                            field: 'string5'

                        }
                    ],
                    data: updated
                });
// add class .editable to make cell values editable
                var td = $('#table2 td');
                for (var i = 0; i < td.length; i++) {
                    if (td.value !== null) {
                        td.addClass("editable")
                    }

                }


            });
        } else {
            $('#errorMessage').fadeIn(100);
            return false;
        }


    });

// editable apply with options
    $(document).on("click", "#table2 td", function (e) {
        $('.editable').editable({
            type: 'text',
            placement: 'bottom',
            emptytext: '',
            title: 'Enter new value'


        });

    });


    //   Getting all values of tr elements and save them in TableData
    $("#SaveButton").click(function () {
        var TableData = [];
        $('#table2 tr').each(function (row, tr) {
            TableData[row] = {
                "string": $(tr).find('td:eq(0)').text(),
                "string1": $(tr).find('td:eq(1)').text(),
                "string2": $(tr).find('td:eq(2)').text(),
                "string3": $(tr).find('td:eq(3)').text(),
                "string4": $(tr).find('td:eq(4)').text(),
                "string5": $(tr).find('td:eq(5)').text()
            };


        });
        //removing thead
        TableData.shift();
        TableData = $.toJSON(TableData);
        // setting up new obj with updated values
        localStorage.setItem("tableJson", TableData);

        $(document).ready(function () {
            $("body").on('click', '#SaveButton', function () {
                window.location.reload();

            });
        });
        $(document).ready(function () {
            $table = $('#table2');
            function exportTableToCSV($table, filename) {

                var $rows = $table.find('tr:has(td)'),

                    // Temporary delimiter characters unlikely to be typed by keyboard
                    // This is to avoid accidentally splitting the actual contents
                    tmpColDelim = String.fromCharCode(11), // vertical tab character
                    tmpRowDelim = String.fromCharCode(0), // null character

                    // actual delimiter characters for CSV format
                    colDelim = '","',
                    rowDelim = '"\r\n"',

                    // Grab text from table into CSV formatted string
                    csv = '"' + $rows.map(function (i, row) {
                            var $row = $(row),
                                $cols = $row.find('td');

                            return $cols.map(function (j, col) {
                                var $col = $(col),
                                    text = $col.text();

                                return text.replace(/"/g, '""'); // escape double quotes

                            }).get().join(tmpColDelim);

                        }).get().join(tmpRowDelim)
                            .split(tmpRowDelim).join(rowDelim)
                            .split(tmpColDelim).join(colDelim) + '"';

                // Deliberate 'false', see comment below
                if (false && window.navigator.msSaveBlob) {

                    var blob = new Blob([decodeURIComponent(csv)], {
                        type: 'text/csv;charset=utf8'
                    });

                    // Crashes in IE 10, IE 11 and Microsoft Edge
                    // See MS Edge Issue #10396033
                    // Hence, the deliberate 'false'
                    // This is here just for completeness
                    // Remove the 'false' at your own risk
                    window.navigator.msSaveBlob(blob, filename);

                } else if (window.Blob && window.URL) {
                    // HTML5 Blob
                    var blob = new Blob([csv], {
                        type: 'text/csv;charset=utf-8'
                    });
                    var csvUrl = URL.createObjectURL(blob);

                    $(this)
                        .attr({
                            'download': filename,
                            'href': csvUrl
                        });
                } else {
                    // Data URI
                    var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

                    $(this)
                        .attr({
                            'download': filename,
                            'href': csvData,
                            'target': '_blank'
                        });
                }
            }

            // This must be a hyperlink
            $("body").on('click', '#SaveButton', function (event) {
                // CSV
                var args = [$('#table2'), 'export.csv'];

                exportTableToCSV.apply(this, args);
                preventDefault();
                // If CSV, don't do event.preventDefault() or return false
                // We actually need this to be a typical hyperlink
            });
        });
    });


});
