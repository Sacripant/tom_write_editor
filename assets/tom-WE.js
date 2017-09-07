(function ($, ace) {

    // Render Shortcut / snippets obj on html Table
    function renderTable(data) {
        console.log(data);
        if (data.target) {
            var tds = data.content.reduce(function(previous, current) {
                return previous + '<tr>' + 
                    '<td>' + current[data.col1] + '</td> ' +
                    // '<td>' + current[data.col2] + '</td>' +
                    '<td class="pre">' + $('<span />').text(current[data.col2]).html() + '</td>' +
                    '</tr>';
            }, '');

            data.target.innerHTML = '<h1>' + data.title +'</h1> <table>' + tds + '</table>';
        }

    }


    var editor = {},
        txpWritePage = {},

        // Store some Txp write page elements
        txpWritePageObj = function() {
            txpWritePage.$title = $('#title');
            txpWritePage.$body = $('#body');
            txpWritePage.$publish = $('.publish');
            txpWritePage.preview = document.getElementById('article_partial_article_view');
        },      

        // Store Editor Objects
        initEditorObj = function() {
            editor.btn = {
                "$show" : $('<button class="tomWE-open" title="open Tom_write_editor"> > twe</button>').appendTo('.body .txp-form-field-label'),
                "$hide" : $('#tomWE-hide-btn'),
                "$save": $('#tomWE-save-btn'),
                "$settings" : $('#tomWE-settings-btn'),
                "$rightContent" : $('#tomWE-rightcontent-btns').find('input'), 
                "$rightSize" : $('#tomWE-panel-size-btns').find('input')
            };
            editor.panel = {
                $right : $('#tomWE-panel-right'),
                $left : $('#tomWE-panel-left') 
            };
            editor.panel.$right.size = 0;
            editor.title = document.getElementsByClassName('tomWE-article_title'); 
            editor.open = false;
            editor.iframe = {
                el : document.getElementById('tomWE-iframe'), 
                page : undefined
            };
            editor.help = {
                el : document.getElementById('tomWE-help'), 
                page: undefined
            };
        },

        // Init Ace Editor with some options
        initAce = function(wrapper) {
            editor.ace = ace.edit(wrapper); // Initialize Ace Editor

            // THEME
            editor.ace.setTheme("ace/theme/sacripant");
            // MODE         
            editor.ace.getSession().setMode("ace/mode/textile");
            // editor.ace options
            editor.ace.getSession().setUseWrapMode(true);
            editor.ace.setShowPrintMargin(true);
            editor.ace.$blockScrolling = Infinity; 
            editor.ace.setOptions({
                enableSnippets: true,
                fontSize: "16px"
            });

            // synchronize with textarea
            editor.ace.getSession().on('change', function(){
                txpWritePage.$body.val(editor.ace.getSession().getValue());
            });

            // Load Ace snippetManager
            editor.snippetManager = ace.require("ace/snippets").snippetManager;

            // Add additional snippets
            var addSnippets = $.getJSON("tom-WE/additional-snippets.json");

            addSnippets.done(function(newSnippets) {
                // console.log(newSnippets);
                editor.snippetManager.register(newSnippets);
            }).fail(function(){
                console.error('tom-WE : Error when import additional-snippets file');
                console.error(arguments[2]);
            });


            /*
             * Add new commands
             */

            editor.ace.commands.addCommands([

                // Show Txp Articles tab
                {
                    name: "showTxpArticlesTab",
                    bindKey: editor.prefs.bindKey.articles,
                    exec: function() {
                        editor.btn.$rightContent.filter('[value="articles"]').click();
                    }
                },

                // Show Txp Images tab
                {
                    name: "showTxpImagesTab",
                    bindKey: editor.prefs.bindKey.images,
                    exec: function() {
                        editor.btn.$rightContent.filter('[value="images"]').click();
                    }
                },
                // Show Txp Files tab
                {
                    name: "showTxpFilesTab",
                    bindKey: editor.prefs.bindKey.files,
                    exec: function() {
                        editor.btn.$rightContent.filter('[value="files"]').click();
                    }
                },
                // Show Txp Links tab
                {
                    name: "showTxpLinksTab",
                    bindKey: editor.prefs.bindKey.links,
                    exec: function() {
                        editor.btn.$rightContent.filter('[value="links"]').click();
                    }
                },
                // Show Txp Preview tab
                {
                    name: "showTxpPreviewTab",
                    bindKey: editor.prefs.bindKey.preview,
                    exec: function() {
                        editor.btn.$rightContent.filter('[value="preview"]').click();
                    }
                },
                // Show Keyboard Shortcuts
                {
                    name: "showKeyboardShortcuts",
                    bindKey: editor.prefs.bindKey.shortcuts,
                    exec: function() {
                        editor.btn.$rightContent.filter('[value="shortcuts"]').click();
                    }
                },
                // Show Snippets
                {
                    name: "showSnippets",
                    bindKey: editor.prefs.bindKey.snippets,
                    exec: function() {
                        editor.btn.$rightContent.filter('[value="snippets"]').click();
                    }
                },
                // Save Article
                {
                    name: "saveArticle",
                    bindKey: editor.prefs.bindKey.save,
                    exec: function() {
                        txpWritePage.$publish.click();
                    }
                }
            ]);



        },


        // Articles, images, files, links, Drag and drop Handler 
        dndHandler = {
            draggedElement: null, // Propriété pointant vers l'élément en cours de déplacement
            applyDragEvents: function(element, pageName) {

                element.draggable = true;
                var dndHandler = this; // Cette variable est nécessaire pour que l'événement « dragstart » accède facilement au namespace « dndHandler »

                element.addEventListener('dragstart', function(e) {
                    dndHandler.draggedElement = e.target; // On sauvegarde l'élément en cours de déplacement
                    e.itemId = $(dndHandler.draggedElement).find('input')[0].value;
                    console.log(e.itemId);
                    e.dataTransfer.setData('text', replaceID(editor.prefs.drop[pageName], e.itemId)); // Nécessaire pour Firefox
                });
            }
        },

        // inject id in snippet
        replaceID = function(string, id) {
            return string.replace('{{ id }}', id);
        }, 

    
        // Show Editor
        showEditor = function() {
            // copy textarea content in Ace editor
            editor.ace.getSession().setValue(txpWritePage.$body.val());

            // add focus in top on Editor
            editor.ace.focus();
                        
            // Clone article title
            $(editor.title).text(txpWritePage.$title.val());
                        
            // Show Editor
            $('html').addClass('tomWE-on');

            editor.open = true;
        },

        // Hide Editor
        hideEditor = function() {
            $('html').removeClass('tomWE-on');  

            editor.open = false;            
        },



        changeRightPanelSize = function(newSize) {
            // console.log(newSize);
            editor.panel.$right.size = newSize;

            editor.panel.$right
                .css("flexGrow", newSize);
        },


        removeRightPanelContent = function () {
            console.log("remove panel right content");
                hideIframe();
                hideHelp();
                // uncheck right panel content btns
                editor.btn.$rightContent.filter(":checked")[0].checked = false;
                // disabled size btns
                editor.btn.$rightSize.each(function(i, el) {
                    el.disabled = true;
                });     
                // console.log(chkBtn);
        },


        rightPanelContent = function(btn) {

            if (!btn){
                return false;
            }

            //  If Right Panel is close
            //  Open right panel and check relative radio btn 
            if (editor.panel.$right.size === "0") {
                changeRightPanelSize(editor.prefs.rightPanelDefaultSize);
                // check relative radio btn
                editor.btn.$rightSize.each(function(i, el) {
                    el.disabled = false;
                    if (el.value === editor.prefs.rightPanelDefaultSize)
                        el.checked = true;
                });
            }

            var idContent = btn.value,
                type = btn.dataset.type;
            // console.log(idContent + " / "+  type);

            // Hide existing Panel content if exist
            hideIframe();
            hideHelp();

            if (idContent && type) {

                switch(type) {

                    case 'iframe':
                        showIframe(idContent, editor.prefs.path[idContent]);
                        break;

                    case 'help-table':
                        showHelp(idContent);
                        break;

                    case 'preview':
                        showIframe(idContent, txpWritePage.preview.href);
                        break;
                }

            }
        },

        // Load Txp pages in right panel iframe
        showIframe = function(idContent, src) {
            editor.panel.$right.addClass('loading');
            editor.iframe.el.src = src;
            $(editor.iframe.el).on('load', function() {
                var $iframeContent = $(editor.iframe.el).contents(),
                    dragItems = $iframeContent.find('.txp-list tbody tr');

                $iframeContent[0].body.classList.add('in-tomWE');

                dragItems.each(function(index, el) {
                    dndHandler.applyDragEvents(el, idContent);
                });

                editor.iframe.el.classList.remove('hide');
                editor.iframe.page = idContent; 

                editor.panel.$right.removeClass('loading');
                // console.log(editor.iframe.page);
            });
        },

        hideIframe = function() {
            if (editor.iframe.page) {
                editor.iframe.el.classList.add('hide');
                $(editor.iframe.el).off('load');
                editor.iframe.page = undefined;
            }
        },

        showHelp = function(action) {
            // console.log('show help');
            switch(action) {
                case 'shortcuts':
                    ace.config.loadModule("ace/ext/menu_tools/get_editor_keyboard_shortcuts", function(module) {
                        var keybordShortcuts = module.getEditorKeybordShortcuts(editor.ace);
                        renderTable({
                            content: keybordShortcuts,
                            target: editor.help.el,
                            title: 'Keyboard Shortcuts',
                            col1Title: 'Command',
                            col1: "command",
                            col2Title: "Shortcut",
                            col2: "key"
                        });
                    });
                    break;

                case 'snippets':
                    ace.config.loadModule("ace/snippets", function(module) {
                        var snippets = [];

                        for ( var i in module.snippetManager.snippetMap ){
                            snippets = snippets.concat(module.snippetManager.snippetMap[i]);
                        }

                        if (snippets.length) {
                            renderTable({
                                content: snippets,
                                target: editor.help.el,
                                title: 'Snippets',
                                col1Title: 'Tab trigger',
                                col1: "tabTrigger",
                                col2Title: "Snippet",
                                col2: "content"
                            });
                        }
                    });
                    break;
            }
            editor.help.page = action;
            editor.help.el.classList.remove('hide');
        },

        hideHelp = function () {
            if (editor.help.page) {
                editor.help.el.classList.add('hide');
                editor.help.page = undefined;               
            }
        };


    window.onload = function() {
        
        // Load Prefs
        $.when(
            $.getJSON("tom-WE/prefs-default.json"), 
            $.getJSON("tom-WE/prefs-user.json")

        ).fail(function(){
            console.error('tom-WE : Error when import prefs JSON files');
            console.error(arguments[2]);

        }).done(function(prefsDefault, prefsUser) {

            // console.log(prefsDefault.responseJSON);
            // console.log(prefsUser);

            txpWritePageObj();
            initEditorObj();
            editor.prefs = $.extend(true, {}, prefsDefault[0], prefsUser[0]);

            // console.log(editor.prefs);
            initAce('tomWE-editor');    
            
                    
            // show Editor
            editor.btn.$show.click(function(e) {
                e.preventDefault();
                showEditor();
            });
            
            // Hide Editor  
            editor.btn.$hide.click(function() {
                hideEditor();           
            });
            
            // Save Article
            // trigger save on save button
            // editor.btn.save[0].value += ' | '+key+'+s';
            editor.btn.$save.click(function(){
                txpWritePage.$publish.click();
                console.log('article saved');
            });


            // Open Ace editor config
            editor.btn.$settings.click(function() {
                editor.ace.execCommand("showSettingsMenu");
            });

            // Load right Panel content
            rightPanelContent(editor.btn.$rightContent.filter(':checked')[0]);
            editor.btn.$rightContent.change(function() {
                rightPanelContent(this);
            });

            // change right panel size
            // changeRightPanelSize(editor.btn.$rightSize.filter(':checked')[0].value);
            editor.btn.$rightSize.change(function() {
                // console.log("click btn size");
                changeRightPanelSize(this.value);
            });
            $(editor.btn.$rightSize.filter(':checked')).change();


            editor.panel.$right.on('transitionend', function () {
                // console.log("panel transitionEnd");
                editor.ace.resize();
                // console.log(editor.panel.$right.size === '0');

                // if close panel right: remove panel right content
                if (editor.panel.$right.size === '0') removeRightPanelContent();
            });


            textpattern.Relay.register('txpAsyncForm.success', function (event, data) {
                console.log('refresh preview if is open');
                if (editor.open && editor.iframe.page === 'preview') {
                    editor.iframe.el.contentWindow.window.location.reload();
                }
            });

            // console.log(editor.panel.$right);
                                    
            $(document).keydown(function(e) {
                if (editor.open) {
                    // esc = hide Editor
                    if (e.keyCode === 27) {
                        console.log("Esc editor");
                        hideEditor();                                   
                    }
                }
            });

            console.log(editor);
            
        });


};


})(jQuery, ace);
