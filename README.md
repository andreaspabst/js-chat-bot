# js-site-chat-bot

## Wiki

Here [in the wiki](https://github.com/andreaspabst/js-site-chat-bot/wiki) you can find the installation guide .

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