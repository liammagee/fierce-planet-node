/*!
 * Fierce Planet - GeneralUI
 * General UI functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains graph functions
 */
FiercePlanet.ModuleEditor = FiercePlanet.ModuleEditor || {};

(function() {
    var moduleEditorDialog, moduleEditor;
    this.moduleEditor = null;


    /**
     * Resets the flot graph
     */
    this.openDialog = function () {
        if (!moduleEditorDialog) {
            moduleEditorDialog = $('#module-editor-dialog')
                .dialog({
                   position: [1100, 605],
                   width: 800,
                   height: 560,
                    autoOpen: false,
                    modal: false,
                    title: 'Module Editor',
                    buttons: {
                        "Run": function() {
                            // Update script to edited version

                            if (FiercePlanet.ModuleEditor.moduleEditor) {
                                var code = FiercePlanet.ModuleEditor.moduleEditor.getValue();
                                try {
                                    eval(code);
                                }
                                catch (e) {
                                    console.log(e)
                                }
                            }
                        },
                        "Cancel": function() {
                            $( this ).dialog( "close" );
                        }
                    }

                });

        }
        moduleEditorDialog.dialog('open');
    };

    this.buildEditorFromUrl = function (url, additionalText) {
        var moduleEditor = $('#module-editor');
        $.get(url, function(data) {
            additionalText = additionalText || '';
            moduleEditor.html(data + '\n\n' + additionalText);
            if (FiercePlanet.ModuleEditor.moduleEditor) {
                //FiercePlanet.ModuleEditor.moduleEditor.setValue(data);
            }
            else {
                FiercePlanet.ModuleEditor.moduleEditor = CodeMirror.fromTextArea(
                    moduleEditor[0], {
                        lineNumbers: true,
                        matchBrackets: true,
                        mode:  "javascript"
                    });

            }
        });

    };

}).apply(FiercePlanet.ModuleEditor);
