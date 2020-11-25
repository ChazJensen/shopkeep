# Shopkeep

### A Discord Bot

shopkeep is a currency and inventory tracker with a bit of added functionality


---


### TODO

TODO:
- [x] backend rewrite
- [x] USE FileHandle class from `fs`
- bot features to implement:
  - [x] set points
    - [x] add points
    - [x] subtract points
  - [ ] shop
    - [ ] creation
    - [ ] management
      - [ ] add/remove item for sale
      - [ ] pricing items
      - [ ] [VOTE_ON] stock: infinite or is there a supply chain?
        - [ ] supply chain would be run by NPCs that you pay for stock
	- decision: 
    - [ ] "selling"
  - [ ] inventory
- boiler plate code for
  - [x] codeblock
  - [x] delay-delete messages (oneliner???)
  * row-to-codeblock parser


---


### Installation

TODO: write out steps for creating a discord bot
TODO: write out steps for storing token

Shopkeep uses discord.js. Once you clone the repo, run

```
npm install discord.js
```

Afterwards, in order to start Shopkeep, run `make`, or `node app`.
If you get errors regarding certain folders not being created, ensure
the following folders exist:

- commands
- data
- lib
- node_modules

Create an issue if you are having trouble with this.


---


### Changelog:

**v1.0.1**: added modes: debug and chatlogger

**v1.0.0**: basic currency tracker--based on messages sent


### Contributors

[ChazJensen](github.com/ChazJensen)
