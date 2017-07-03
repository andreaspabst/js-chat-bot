/**
 * @author Andreas Pabst <kontakt@andreas-pabst.de>
 * @version 1.0.4
 *
 * JS Site Chat Bot Script enhancing user experience
 * @module andreaspabst/js-site-chat-bot
 * @license MIT
 * Copyright 2017 Andreas Pabst

     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
     documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
     rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is furnished to
     do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
     WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
     IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/**
 * JS Site Chat Bot Script by andreas pabst
 * @returns {{}}
 * @constructor
 */
function Chat() {
    var obj = {};

    /********* VARIABLES ****************/
    obj.formData = {};
    obj.debug = false;     // debug console.log
    obj.talk = {};         // talk array
    obj.version = "1.0.4"; // current version of chat js

    obj.regex = {
        // format input fields
        input: /:input:([A-z]+):/,
        // format links look like [text 123](link "title")
        linkLg: /\[([\w\s\-\'\=\#\+]+)\]\(([\w\/\.\:\-\?\#\=\%]+) \"([\w\s\-\'\=\#\+]+)\"\)/,
        // format links look like [text 123](link)
        linkSm: /\[([\w\s\-\'\=\#\+]+)\]\(([\w\/\.\:\-\?\#\=\%]+)\)/,
        // format emojis
        emoji: /:emoji:([A-z]+):/
    };

    obj.configuration = {
        behaviour: {
            autoScroll: true,                  // use jQuery Scroll To Function
            autoDetectLanguage: false,         // if useLanguages: true then use browser lang
            autoScrollAfterFirstAnswer: true,  // wait until first answer has been given
            autoResize: true,                  // continuous adaption of height of mainChat
            defaultLang: "en",                 // relevant if useLanguages: true
            showTypingDots: true,              // show "..." dots first
            useEmoji: true,                    // :emoji:xyz: is an emoji with name xyz
            useInputs: true,                   // :input:xyz: is a text input with name xyz
            useLanguages: false                // parse talks with languages
        },
        formPost: {
            ajaxUrl: "",
            ajaxType: "POST"
        },
        ids: {
            mainChat: "chat",        // the chat container, with chatWrap and answerWrap
            answerPrefix: "answer-"  // prefix of answer link "prefix-0", "prefix-1",...
        },
        classes: {
            answer: "chat-answer",                      // class of answer link
            answerWrap: "chat-answer-select",           // class of answer box
            bubbleWrap: "chat-bubble",                  // class of any bubble
            bubble: "chat-bubble-msg",                  // class of any bubble
            bubbleBot: "chat-bubble-msg-me",            // class of bot bubble
            bubbleVisitor: "chat-bubble-msg-visitor",   // class of visitors answer bubble
            chatWrap: "chat-wrap",                      // wrapper of the chat bubbles
            emojiPrefix: "em em-"                       // emoji class <i class="prefix-emoji"></i>
        },
        times: {
            delay: {
                "overall": 0,       // general delay to start chatting
                "dots": 700,        // delay until dots will be replaced
                "botsTalk": 1200,   // delay between every single chat bubble
                "showAnswer": 200   // delay after the last bubble has been displayed
            },
            speed: {
                "dotsFadeInOut": 400,   // fade in/out speed of dots display/removal
                "chatBlockFadeIn": 400, // speed of chat block fadein
                "scrollingSpeed": 700   // speed for scrollTo()
            }
        }
    }

    obj.talkPosition = 'init';  // pointer for current talk position
    obj.browserLanguage = '';   // variable for browser languages string
    obj.usedLang = '';          // variable for used language in chat
    obj.heightChat = 0;         // height of main chat element
    obj.heightAnswers = 0;      // height of answer wrapper

    /********* FUNCTIONS ****************/

    /**
     * Initialize Chat
     */
    obj.init = function(params) {
        // check requirement: jquery
        if (typeof jQuery == 'undefined') {
            throw "Error: jQuery is required but not loaded."; return false;
        }
        // check requirement: config params
        if (typeof params === "undefined") {
            throw "Error: No configuration found. Either pass ajax parameter or whole settings"; return false;
        }

        // define browser language
        this.browserLanguage = navigator.language || navigator.userLanguage;

        // if ajax is set as configuration source it will overwrite all other settings
        if (typeof params.ajax !== "undefined") {
            this.chatLog("Fetching ajax settings...");
            $.getJSON( params.ajax, function(json) {
                // fetch all settings
                this.parseSettings(json);

                // generate html framework
                this.generateHtml();

                // parse talking messages
                this.parseTalks(json);

                // start talking
                setTimeout(function() { this.botTalks(); }.bind(this), this.configuration.times.delay.overall)
            }.bind(this));
        } else {
            this.chatLog("Using settings passed by parameter...");
            // fetch all settings
            this.parseSettings(params);

            // generate html framework
            this.generateHtml();

            // parse talking messages
            this.parseTalks(params);

            // start talking
            setTimeout(function() { this.botTalks(); }.bind(this), this.configuration.times.delay.overall)
        }
    }

    obj.parseSettings = function(json) {
        // Parse JSON config to Chat() config
        if (typeof json !== "undefined") {

            // Parse config section if available
            if (typeof json.config !== "undefined") {

                // Enable / Disable Debug mode
                if (typeof json.config.debug !== "undefined") {
                    this.debug = (json.config.debug == true) ? true : false;
                }

                // Apply behaviour settings
                if (typeof json.config.behaviour !== "undefined") {
                    $.each(json.config.behaviour, function (k, v) {
                        if (typeof this.configuration.behaviour[k] !== "undefined") {
                            this.configuration.behaviour[k] = v;
                        }
                    }.bind(this))
                }

                // Apply formPost settings
                if (typeof json.config.formPost !== "undefined") {
                    $.each(json.config.formPost, function (k, v) {
                        if (typeof this.configuration.formPost[k] !== "undefined") {
                            this.configuration.formPost[k] = v;
                        }
                    }.bind(this))
                }

                // Apply css class settings
                if (typeof json.config.classes !== "undefined") {
                    $.each(json.config.classes, function (k, v) {
                        if (typeof this.configuration.classes[k] !== "undefined") {
                            this.configuration.classes[k] = v;
                        }
                    }.bind(this))
                }

                // Apply html ID settings
                if (typeof json.config.ids !== "undefined") {
                    $.each(json.config.ids, function (k, v) {
                        if (typeof this.configuration.ids[k] !== "undefined") {
                            this.configuration.ids[k] = v;
                        }
                    }.bind(this))
                }

                // Parse times config section if available
                if (typeof json.config.times !== "undefined") {
                    $.each( json.config.times, function(section,variables) {
                        $.each(variables, function (k, v) {
                            if (typeof this.configuration.times[section][k] !== "undefined") {
                                if (v >= 0) {
                                    this.configuration.times[section][k] = v;
                                } else {
                                    throw "Error: A configuration value for times."+section+"."+k+" < 0 is not allowed";
                                }
                            }
                        }.bind(this))
                    }.bind(this))
                }
            }
        } else {
            // no json settings found, aborting..
            throw "Error: JSON settings not found..";
            return false;
        }

        /////// Overwrite some logical stuff
        // if typingDots is disabled, dots delay is zero
        if (this.configuration.behaviour.showTypingDots == false) {
            this.configuration.times.delay.dots = 0;
        }

        // if autoScrollAfterFirstAnswers is enabled, enabling autoScrolling makes sense
        if (this.configuration.autoScrollAfterFirstAnswer == true) {
            this.autoScroll = true;
        }

        // a scroll speed of zero makes sense here..
        if (this.autoScroll == false) {
            this.configuration.speed.scrollingSpeed = 0;
        }
    }

    obj.handleLanguage = function() {
        if (this.configuration.behaviour.useLanguages == true) {
            // languages should be used...
            this.chatLog("Language usage activated");
            if (this.configuration.behaviour.autoDetectLanguage == true) {
                // Check for the browsers language
                this.usedLang = this.browserLanguage.split('-')[0];
            } else {
                // Use default language set up in configuration
                this.usedLang = this.configuration.behaviour.defaultLang;
            }
            this.chatLog("Switched to '"+this.usedLang+"' language");
        }
    }

    obj.parseTalks = function(json) {
        // Handle language stuff
        this.handleLanguage();

        // Get Talk messages
        if (typeof json.talk !== "undefined") {
            if (this.configuration.behaviour.useLanguages == true && this.usedLang != "") {
                // Check if localized talk array exists
                if (typeof json.talk[this.usedLang] === "undefined") {
                    throw "Error: Language '"+this.usedLang+"' could not be found...";
                }

                // Look for 'init' in actual set language
                if (typeof json.talk[this.usedLang].init !== "undefined") {
                    this.talk = json.talk[this.usedLang];
                    this.chatLog("Language found");
                } else {
                    throw "Error: There is no init point for talk in language "+this.usedLang+"...";
                }
            } else {
                // Look for 'init' in default single language talk
                if (typeof json.talk.init !== "undefined") {
                    this.talk = json.talk;
                } else {
                    throw "Error: There is no init point for talk...";
                }
            }
        } else {
            throw "Error: There is no talk declaration in JSON file...";
        }
    }

    obj.generateHtml = function() {
        // Append Chat Wrapper and Answer Wrapper
        if (typeof $("#"+this.configuration.ids.mainChat)) {
            var $chatWrap = '<div class="'+this.configuration.classes.chatWrap+'"></div>';
            var $answerWrap = '<div class="'+this.configuration.classes.answerWrap+'"></div>';
            $("#"+this.configuration.ids.mainChat).append($chatWrap, $answerWrap);
        } else {
            throw "Error: Container #"+this.configuration.ids.mainChat+" not found.";
            return false;
        }

        // init some values regarding container heights
        this.heightAnswers = $("."+this.configuration.classes.answerWrap).height()
        this.heightChat = $("#"+this.configuration.ids.mainChat).height();
    }

    /**
     * Bot says anything..
     */
    obj.botTalks = function() {
        this.chatLog("- Bot starts talking on "+this.talkPosition+"..");
        if (typeof this.talk[this.talkPosition] !== "undefined") {
            if (typeof this.talk[this.talkPosition].talks !== "undefined") {
                this.talk[this.talkPosition].talks.forEach( function(msg, i) {
                    var timeDelay = this.configuration.times.delay.dots +
                        this.configuration.times.delay.botsTalk * (i+1);
                    setTimeout(function() {
                        this.newChatBubble( "bot", msg )
                    }.bind(this), timeDelay);
                }.bind(this));
            } else {
                throw "Error: No bot talks found";
            }
        } else {
            this.chatLog(" - No more answers available");
            return false;
        }

        // Show answers after the last chat bubble has been loaded
        var timeDelay = ((this.talk[this.talkPosition].talks.length
            * (this.configuration.times.delay.botsTalk + this.configuration.times.delay.dots))
            + this.configuration.times.delay.showAnswer);
        setTimeout(function () {
            this.showAnswers();
            if (this.configuration.behaviour.autoScroll == true) {
                if (this.configuration.behaviour.autoScrollAfterFirstAnswer == true) {
                    // Don't do scrolling if it's first reply
                    if (this.talkPosition == "init") {
                        this.chatLog("Skip scrolling on first reply..");
                        return false;
                    }
                }
                // Do an autoscroll
                this.chatLog("Scrolling...");
                $("body").animate({
                    scrollTop: $("."+this.configuration.classes.bubble+":last-of-type").position().top
                }, this.configuration.times.scrollingSpeed);
            }
        }.bind(this), timeDelay);
    }

    /**
     * Create a new Chat Bubble
     * @param who [bot, visitor]
     * @param text
     */
    obj.newChatBubble = function( who, text ) {
        this.chatLog("- -- * Add new Bubble for "+who+" with "+text);

        // Define variables
        var bubbleClass = (who == "bot") ? this.configuration.classes.bubbleBot : this.configuration.classes.bubbleVisitor;
        var initialContent = (this.configuration.behaviour.showTypingDots) ? "..." : this.formatContent(text);
        var $chatBlock = $("<div class='"+this.configuration.classes.bubbleWrap+"'><div class='"+this.configuration.classes.bubble+" "+bubbleClass+"'>"+initialContent+"</div></div>");

        // Add bubble to chat
        $chatBlock.hide();
        $("#"+this.configuration.ids.mainChat+" ."+this.configuration.classes.chatWrap+"").append($chatBlock);
        $chatBlock.fadeIn(this.configuration.times.speed.chatBlockFadeIn);

        // Expand chat and resize if enabled
        if (this.configuration.behaviour.autoResize == true) {
            var elemHeight = $chatBlock.height();
            this.expandChat(elemHeight);
        }

        // If using typing dots, hide box, replace text and fadeIn again
        if (this.configuration.behaviour.showTypingDots) {
            setTimeout(function () {
                var chatApp = this; // its non sense to bind this here.. it would overwrite $(this)
                $chatBlock.find("." + chatApp.configuration.classes.bubble + "").fadeOut(chatApp.configuration.times.speed.dotsFadeInOut, function () {
                    $(this).html(chatApp.formatContent(text)).fadeIn(chatApp.configuration.times.speed.dotsFadeInOut);
                });
            }.bind(this), this.configuration.times.delay.dots);
        }
    }

    /**
     * Show all possible answers in this step
     */
    obj.showAnswers = function() {
        this.chatLog("- Show answers for "+this.talkPosition+"...");

        // Define some variables
        var answerContent = "";

        // Check if this talk position exists and has answers
        if (typeof this.talk[this.talkPosition] !== "undefined" &&
            typeof this.talk[this.talkPosition].answers !== "undefined") {

            // Answers found, clear up answerWrap
            $("."+this.configuration.classes.answerWrap+"").html('');

            // Loop through the answers and generate answerWrap content
            this.talk[this.talkPosition].answers.forEach(function(answer, i) {
                this.chatLog("- -- - "+answer);
                answerContent = answerContent + "<a href='javascript:;' class='"+this.configuration.classes.answer+"' id='"+this.configuration.ids.answerPrefix+""+i+"'>"+this.formatContent(answer)+"</a>";
            }.bind(this));

            // Generate answer elements with onclick function
            var $answerElem = $("<div>"  + answerContent + "</div>").click(function(el) {
                if (typeof $(el.target).context !== "undefined") { // jQuery v1.x.
                    var target = $(el.target).context;
                } else if (typeof $(el.target) !== "undefined") { // jQuery v3.x
                    var target = $(el.target)[0];
                } else {
                    throw "Answer could not be found... Changing your jQuery Version could help..."
                }

                // do nothing if the clicked element is an input
                if ($(target).prop("tagName").toLowerCase() == "input") {
                    this.chatLog("You have clicked into an input element.."); return false;
                }

                // if the answer has an input field do nothing,... only enter makes sense
                if ($(target).has("input").length > 0) { this.chatLog("There is an input.. Only enter works"); return false; }

                // do the usual answer stuff
                this.answer(target.id.substr( this.configuration.ids.answerPrefix.length ), target.innerHTML);
            }.bind(this)).keyup(function(event) {
                if (event.keyCode == 13) { // enter
                    // store values
                    var inputValue = event.target.value.replace(/<(?:.|\n)*?>/gm, '');
                    var inputName = event.target.name;

                    // add the entered data to temporarily form object
                    this.chatLog("Add new details to form object: "+inputName+" = "+inputValue);
                    this.formData[inputName] = inputValue;

                    // replace input field with form value and fake a click on the link object
                    var parent = $(event.target.parentNode);
                    $(event.target).replaceWith(inputValue);
                    parent.trigger("click");
                }
            }.bind(this));


            // Append answerWrap content to answerWrap
            $("."+this.configuration.classes.answerWrap).append($answerElem);

            // recalculate size and resize if enabled
            if (this.configuration.behaviour.autoResize == true) {
                this.heightAnswers = $answerElem.height();
                this.expandChat(this.heightAnswers);
            }
        } else {
            this.chatLog("<< No other answers available..");
        }
    }

    /**
     * User is answering.. Callback function
     * @param el
     * @param talkPositionNext
     */
    obj.answer = function(answerIndex, content) {
        // Callback function after user selected answer
        var next = "";

        console.log(this.talk[this.talkPosition].answers[answerIndex]);

        // Check if the current talk position and the answerIndex exists
        if (typeof this.talk[this.talkPosition] === "undefined") { return false; }
        if (typeof this.talk[this.talkPosition].next[answerIndex] !== "undefined") {
            next = this.talk[this.talkPosition].next[answerIndex];
        } else {
            throw "Error: There is no answer for "+answerIndex+" in "+this.talkPosition;
        }

        // Debugging reason
        this.chatLog(">> Answer "+answerIndex+" of Talk position "+this.talkPosition+" selected.. Next: '"+next+"'.");

        // create a new hidden chatBlock element
        var $chatBubble = $(
            "<div class=\""+this.configuration.classes.bubbleWrap+"\">"+
                "<div class=\""+this.configuration.classes.bubble+" "+this.configuration.classes.bubbleVisitor+"\">"
                +content+
                "</div>"+
            "</div>").hide();

        // append chatBubble to chatWrap in mainChat
        $("#"+this.configuration.ids.mainChat+" ."+this.configuration.classes.chatWrap+"").append($chatBubble);

        // display the hidden chat bubble
        $chatBubble.fadeIn();

        // hide answer block, clear it and fade in again
        $("."+this.configuration.classes.answerWrap+"").fadeOut().html('').fadeIn();

        // Expand chat and resize if enabled
        if (this.configuration.behaviour.autoResize == true) {
            var elemHeight = $chatBubble.height();
            this.expandChat(elemHeight);
        }

        // setup talking position to next and let bot answer
        this.talkPosition = next;
        this.botTalks();
    }

    /**
     * Format emojis, inputs and links in bubble content
     * @param text
     * @returns formated text
     */
    obj.formatContent = function(text) {
        // format input fields
        while ((inputFields = this.regex.input.exec(text)) !== null) {
            if (inputFields != null) {
                text = text.replace(inputFields[0], '<input type="text" name="'+inputFields[1]+'" placeholder="Start typing...">');
            }
        }

        // format links look like [text 123](link "title")
        while ((links = this.regex.linkLg.exec(text)) !== null) {
            if (links != null && typeof links[1] !== "undefined" && typeof links[2] !== "undefined" && typeof links[3] !== "undefined") {
                text = text.replace(links[0], "<a href=\""+links[2]+"\" title=\""+links[3]+"\" target=\"_blank\">"+links[1]+"</a> ");
            }
        }

        // format links look like [text 123](link)
        while ((links = this.regex.linkSm.exec(text)) !== null) {
            if (links != null && typeof links[1] !== "undefined" && typeof links[2] !== "undefined") {
                console.log(links);
                text = text.replace(links[0], "<a href=\""+links[2]+"\" target=\"_blank\">"+links[1]+"</a> ");
            }
        }

        // format emojis
        if (this.configuration.behaviour.useEmoji == true) {
            while ((emojiFields = this.regex.emoji.exec(text)) !== null) {
                if (emojiFields != null && typeof emojiFields[0] !== "undefined" && typeof emojiFields[1] !== "undefined")
                text = text.replace(emojiFields[0], '<i class="'+this.configuration.classes.emojiPrefix+'-'+emojiFields[1]+'"></i>');
            }
        }

        // if there is the :submit: keyword in the text, remove it and submit this.formData to ajax url
        if (text.indexOf(":submit:") >= 0) {
            text = text.replace(":submit:", "");
            $.ajax({
                type: this.configuration.formPost.ajaxType,
                url: this.configuration.formPost.ajaxUrl,
                data: this.formData,
                success: function(data) { console.log(data); console.log("Erfolg"); }
            })
        }

        return text;
    }

    /**
     * Expand method if configuration.behaviour.autoResize is enabled
     * @param byPixel
     */
    obj.expandChat = function(byPixel) {
        this.chatLog("++++++++ Resize chat by "+byPixel+"px");
        if (this.configuration.behaviour.autoResize == true) {
            this.heightChat = this.heightChat + byPixel;
            $("#"+this.configuration.ids.mainChat+"").css('height', this.heightChat+"px");
        }
    }

    /**
     * For debugging reason
     * @param story
     */
    obj.chatLog = function(story) {
        if (this.debug == true) {
            console.log(story);
        }
    }

    return obj;
}