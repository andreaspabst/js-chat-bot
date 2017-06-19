function Chat() {
    var obj = {};

    /********* VARIABLES ****************/

    obj.debug = false;   // debug console.log
    obj.talk = {};       // talk array

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
        // some variables
        var that = this;

        // define browser language
        this.browserLanguage = navigator.language || navigator.userLanguage;

        // if ajax is set as configuration source it will overwrite all other settings
        if (typeof params.ajax !== "undefined") {
            $.getJSON( params.ajax, function(json) {
                // fetch all settings
                that.parseSettings(json);

                // generate html framework
                that.generateHtml();

                // parse talking messages
                that.parseTalks(json);

                // start talking
                setTimeout(function() { that.botTalks(); }, that.configuration.times.delay.overall)
            });
        }
    }

    obj.parseSettings = function(json) {
        // some variables
        var that = this;

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
                        if (typeof that.configuration.behaviour[k] !== "undefined") {
                            that.configuration.behaviour[k] = v;
                        }
                    })
                }

                // Apply css class settings
                if (typeof json.config.classes !== "undefined") {
                    $.each(json.config.classes, function (k, v) {
                        if (typeof that.configuration.classes[k] !== "undefined") {
                            that.configuration.classes[k] = v;
                        }
                    })
                }

                // Apply html ID settings
                if (typeof json.config.ids !== "undefined") {
                    $.each(json.config.ids, function (k, v) {
                        if (typeof that.configuration.ids[k] !== "undefined") {
                            that.configuration.ids[k] = v;
                        }
                    })
                }

                // Parse times config section if available
                if (typeof json.config.times !== "undefined") {
                    $.each( json.config.times, function(section,variables) {
                        $.each(variables, function (k, v) {
                            if (typeof that.configuration.times[section][k] !== "undefined") {
                                if (v >= 0) {
                                    that.configuration.times[section][k] = v;
                                } else {
                                    throw "A configuration value for times."+section+"."+k+" < 0 is not allowed";
                                }
                            }
                        })
                    })
                }
            }
        } else {
            // no json settings found, aborting..
            throw "JSON settings not found..";
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
                    throw "Language '"+this.usedLang+"' could not be found...";
                }

                // Look for 'init' in actual set language
                if (typeof json.talk[this.usedLang].init !== "undefined") {
                    this.talk = json.talk[this.usedLang];
                    this.chatLog("Lanugage found");
                } else {
                    throw "There is no init point for talk in language "+this.usedLang+"...";
                }
            } else {
                // Look for 'init' in default single language talk
                if (typeof json.talk.init !== "undefined") {
                    this.talk = json.talk;
                } else {
                    throw "There is no init point for talk...";
                }
            }
        } else {
            throw "There is no talk declaration in JSON file...";
        }
    }

    obj.generateHtml = function() {
        // Append Chat Wrapper and Answer Wrapper
        if (typeof $("#"+this.configuration.ids.mainChat)) {
            var $chatWrap = '<div class="'+this.configuration.classes.chatWrap+'"></div>';
            var $answerWrap = '<div class="'+this.configuration.classes.answerWrap+'"></div>';
            $("#"+this.configuration.ids.mainChat).append($chatWrap, $answerWrap);
        } else {
            throw "Container #"+this.configuration.ids.mainChat+" not found.";
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
        var that = this;
        if (typeof this.talk[this.talkPosition] !== "undefined") {
            if (typeof this.talk[this.talkPosition].talks !== "undefined") {
                this.talk[this.talkPosition].talks.forEach( function(msg, i) {
                    var timeDelay = that.configuration.times.delay.dots +
                        that.configuration.times.delay.botsTalk * (i+1);
                    setTimeout(function() {
                        that.newChatBubble( "bot", msg )
                    }, timeDelay);
                });
            } else {
                throw "No bot talks found";
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
            that.showAnswers();
            if (that.configuration.behaviour.autoScroll == true) {
                if (that.configuration.behaviour.autoScrollAfterFirstAnswer == true) {
                    // Don't do scrolling if it's first reply
                    if (that.talkPosition == "init") {
                        that.chatLog("Skip scrolling on first reply..");
                        return false;
                    }
                }
                // Do an autoscroll
                that.chatLog("Scrolling...");
                $("body").animate({
                    scrollTop: $("."+that.configuration.classes.bubble+":last-of-type").position().top
                }, this.configuration.times.scrollingSpeed);
            }
        }, timeDelay);
    }

    /**
     * Create a new Chat Bubble
     * @param who [bot, visitor]
     * @param text
     */
    obj.newChatBubble = function( who, text ) {
        this.chatLog("- -- * Add new Bubble for "+who+" with "+text);

        // Define variables
        var that = this;
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
                $chatBlock.find("." + that.configuration.classes.bubble + "").fadeOut(that.configuration.times.speed.dotsFadeInOut, function () {
                    $(this).html(that.formatContent(text)).fadeIn(that.configuration.times.speed.dotsFadeInOut);
                });
            }, this.configuration.times.delay.dots);
        }
    }

    /**
     * Show all possible answers in this step
     */
    obj.showAnswers = function() {
        this.chatLog("- Show answers for "+this.talkPosition+"...");

        // Define some variables
        var that = this;
        var answerContent = "";

        // Check if this talk position exists and has answers
        if (typeof this.talk[this.talkPosition] !== "undefined" &&
            typeof this.talk[this.talkPosition].answers !== "undefined") {

            // Answers found, clear up answerWrap
            $("."+this.configuration.classes.answerWrap+"").html('');

            // Loop through the answers and generate answerWrap content
            this.talk[this.talkPosition].answers.forEach(function(answer, i) {
                that.chatLog("- -- - "+answer);
                answerContent = answerContent + "<a href='javascript:;' class='"+that.configuration.classes.answer+"' id='"+that.configuration.ids.answerPrefix+""+i+"'>"+that.formatContent(answer)+"</a>";
            });

            // Generate answer elements with onclick function
            var $answerElem = $("<div>"  + answerContent + "</div>").click(function(el) {
                var target = $(el.target).context;
                that.answer(target.id.substr( that.configuration.ids.answerPrefix.length ), target.innerHTML);
            });

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

        // Check if the current talk position and the answerIndex exists
        if (typeof this.talk[this.talkPosition] === "undefined") { return false; }
        if (typeof this.talk[this.talkPosition].next[answerIndex] !== "undefined") {
            next = this.talk[this.talkPosition].next[answerIndex];
        } else {
            throw "There is no answer for "+answerIndex+" in "+this.talkPosition;
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
        var inputRegex = /:input:([A-z]+):/;
        inputFields = inputRegex.exec(text);
        if (inputFields != null) {
            text = text.replace(inputFields[0], '<input type="text" name="'+inputFields[1]+'" placeholder="Start typing...">');
        }

        // format links
        // var aRegex = /:url:([A-z:_-\/]+):/;
        // inputFields = inputRegex.exec(text);
        // if (inputFields != null) {
        //     text = text.replace(inputFields[0], '<input type="text" name="'+inputFields[1]+'" placeholder="Start typing...">');
        // }

        // format emojis
        if (this.configuration.behaviour.useEmoji == true) {
            var emojiRegex = /:emoji:([A-z]+):/;
            emojiFields = emojiRegex.exec(text);
            if (emojiFields  != null) {
                text = text.replace(emojiFields[0], '<i class="'+this.configuration.classes.emojiPrefix+'-'+emojiFields[1]+'"></i>');
            }
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