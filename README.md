# js-chat-bot

## Description

A special way to bind the customer to your page. 
Let them chat with a javascript chat bot alternative. 
They will likely click on a predefined answer, than typing any text messages... 

Start enhancing your customers experience and let your visitors believe they are chatting with you - live! 

## Project Page & Support

This Script has an own [Project Page](https://andreaspabst.github.io/js-chat-bot/).
I've used this tool on my Website [Andreas Pabst Webentwickler Nürnberg](http://www.andreas-pabst.de).

## Wiki

Here [in the Javascript Chat Bot Wiki](https://github.com/andreaspabst/js-chat-bot/wiki) you can find the installation guide .

## Versions

- 1.0.0 - Initial Version
- 1.0.1 - Added Emoji Support
- 1.0.2 - Added URL
- 1.0.3 - Documentation Updates
- 1.0.4 - Emoji improvements

## Available Configurations

```javascript
configuration = {
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
            chatWrap: "chat-wrap",                      // wrapper of the chat bubbles
            bubbleWrap: "chat-bubble",                  // class of any bubble
            bubble: "chat-bubble-msg",                  // class of any bubble
            bubbleBot: "chat-bubble-msg-me",            // class of bot bubble
            bubbleVisitor: "chat-bubble-msg-visitor",   // class of visitors answer bubble
            answer: "chat-answer",                      // class of answer link
            answerWrap: "chat-answer-select"            // class of answer box
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
```

## Installation

Include Chat Bot JS in your page footer. Please be sure to include jQuery before including js-site-chat-bot.

`<script src="https://cdn.rawgit.com/andreaspabst/js-chat-bot/master/build/js/chat-min.js"></script>`

Initialize the script by using the following element:
```html
<div class="col-full-width" id="chat"></div>
<script type="text/javascript">
  var chat = new Chat();
  chat.init({ajax: '/chat.json'});
</script>
```

You can either pass the `ajax` param with an url to the json config file or pass all the config directly into the init function.

## Sample Config File

```json
{
  "config": {
    "debug": false,
    "behaviour": {
      "autoScroll": false,
      "autoResize": true,
      "showTypingDots": true,
      "useEmoji": true,
    },
    "times": {
      "delay": {
        "overall": 1000,
        "showAnswer": 1000,
        "botsTalk": 800
      }
    },
    "classes": {
      "chatWrap": "chat-wrap"
    }
  },
  "talk": {
    "init": {
      "talks": [
        "Hi there :emoji:smiley:, it's me!",
        "Do you feel like talking?"
      ],
      "answers": [
        "Yeah, sure!",
        "Naah, I just want to look around.."
      ],
      "next": [
        "talking1",
        ""
      ]
    },
    "talking1": {
      "talks": [
        "Alright then...",
        "Why don't you call me on my phone?"
      ],
      "answers": [],
      "next": []
    }
  }
}
```

## Configuration

```javascript
configuration = {
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
```

## Writing a conversation

A conversation is called talk in js-site-chat-bot. A talk consists of at least one `init` element:

```json
  "talk": {
    "init": {
      "talks": [
        "Hello world!"
      ],
      "answers": [
        "Yeah, sure!",
        "Naah, I just want to look around.."
      ],
      "next": [
        "talking1",
        "donttalk1"
      ]
    },
  //...
  }
```

## Writing multi language conversation

To ensure multi language functionality, e.g. by selecting the default browser language, simply enable language feature by passing the following options

```json
{
 "config": {
    "behaviour": {
      "useLanguages": false,
      "autoDetectLanguage": true
    }
  }
}
```

To provide a conversation for each language, simply use the following structure for a talk element

```json
"talk": {
    "en": {
      "init": {
        "talks": ["...", "..."],
        "answers": ["...","..."],
        "next": ["a1","a2"]
      },
      "a1": {
        "talks": ["...", "..."],
        "answers": ["...","..."],
        "next": []
      },
      "a2": {
        "talks": ["...", "..."],
        "answers": ["...","..."],
        "next": []
      }
    },
    "de": {
      "init": {
        "talks": ["...", "..."],
        "answers": ["...","..."],
        "next": ["a1","a2"]
      },
      "a1": {
        "talks": ["...", "..."],
        "answers": ["...","..."],
        "next": []
      },
      "a2": {
        "talks": ["...", "..."],
        "answers": ["...","..."],
        "next": []
      }
    }
  }
```

## Using emojis in conversations

You may also use emojis in a conversation. To use them, you have to enable emojis in configuration
```json
{
  "config": {
    "behaviour": {
      "useEmoji": true
    }
  }
}
```

Usage: In any bot message or answer, just use :emoji:XYZ: which will be transformed into an italic element `<i class="em em-XYZ"></i>`. You are able to change the emoji class by defining the following setup in the config tree `config.classes.emojiPrefix`.

## License

Copyright 2017 Andreas Pabst

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